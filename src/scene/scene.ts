/* =========================================================
   scene.ts — the WebGL layer behind the page.

   Two draw calls: a full-screen colour field, and one blob of
   liquid glass that refracts it. The glass does not use a
   transmission pass; the field is a pure function in GLSL, so
   the blob just evaluates it again at a bent coordinate.

   Colours come from the CSS tokens in global.css (--bg and
   --field-1..4), so light and dark stay defined in one place.

   This module is loaded lazily (see Scene.tsx) to keep three.js
   out of the main bundle.
   ========================================================= */

import {
  BufferAttribute,
  BufferGeometry,
  IcosahedronGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderer,
} from 'three';

const MAX_PIXEL_RATIO = 1.5;
const CAMERA_Z = 6;
const FOV = 35;

/** Shared by both shaders: the colour field as a function of screen position. */
const FIELD_GLSL = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uRes;
  uniform vec3 uBg;
  uniform vec4 uField[4];

  vec3 field(vec2 uv) {
    float aspect = uRes.x / uRes.y;
    float unit = max(aspect, 1.0);
    vec2 p = vec2(uv.x * aspect, uv.y + uScroll * 0.12);
    float t = uTime * 0.12;
    vec2 c0 = vec2(0.08 * aspect, 0.96) + 0.10 * vec2(sin(t * 1.3), cos(t * 1.1));
    vec2 c1 = vec2(0.92 * aspect, 0.82) + 0.12 * vec2(cos(t * 0.9), sin(t * 1.4));
    vec2 c2 = vec2(0.75 * aspect, 0.08) + 0.11 * vec2(sin(t * 1.1 + 2.0), cos(t * 0.8));
    vec2 c3 = vec2(0.12 * aspect, 0.22) + 0.09 * vec2(cos(t * 1.2 + 1.0), sin(t));
    vec3 col = uBg;
    col = mix(col, uField[0].rgb, uField[0].a * smoothstep(0.34 * unit, 0.0, length(p - c0)));
    col = mix(col, uField[1].rgb, uField[1].a * smoothstep(0.30 * unit, 0.0, length(p - c1)));
    col = mix(col, uField[2].rgb, uField[2].a * smoothstep(0.36 * unit, 0.0, length(p - c2)));
    col = mix(col, uField[3].rgb, uField[3].a * smoothstep(0.26 * unit, 0.0, length(p - c3)));
    return col;
  }

  // Breaks up 8-bit banding in the slow gradients.
  vec3 dither(vec3 col) {
    float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    return col + (n - 0.5) / 255.0;
  }
`;

const FIELD_VERT = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }
`;

const FIELD_FRAG = /* glsl */ `
  ${FIELD_GLSL}
  void main() {
    gl_FragColor = vec4(dither(field(gl_FragCoord.xy / uRes)), 1.0);
  }
`;

const BLOB_VERT = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;

  vec3 displace(vec3 p) {
    float t = uTime * 0.35;
    float n = sin(p.x * 1.7 + t) * cos(p.y * 1.9 - t * 0.8)
            + sin(p.z * 2.3 + t * 1.2) * cos(p.x * 1.3 + p.y * 1.1 - t * 0.6);
    return p * (1.0 + 0.11 * n);
  }

  void main() {
    // Rebuild the normal from two displaced neighbours on the sphere.
    vec3 n0 = normalize(position);
    vec3 tangent = normalize(cross(n0, abs(n0.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0)));
    vec3 bitangent = cross(n0, tangent);
    vec3 p = displace(n0);
    vec3 pt = displace(normalize(n0 + tangent * 0.01));
    vec3 pb = displace(normalize(n0 + bitangent * 0.01));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalMatrix * normalize(cross(pt - p, pb - p));
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const BLOB_FRAG = /* glsl */ `
  ${FIELD_GLSL}
  uniform float uDark;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vView);
    float fresnel = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 3.0);

    // Lens: look the field up where a refracted ray would land,
    // split slightly per channel for dispersion at the rim.
    vec2 uv = gl_FragCoord.xy / uRes;
    vec2 bend = -n.xy * (0.22 + 0.3 * fresnel);
    vec3 col = vec3(
      field(uv + bend * 0.9).r,
      field(uv + bend).g,
      field(uv + bend * 1.1).b
    );

    // Glass gathers light: richer on a pale page, brighter on a dark one.
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, 1.7);
    col = mix(col * 0.97, col * 1.9 + 0.03, uDark);

    vec3 rim = mix(vec3(0.16, 0.42, 0.86), vec3(0.72, 0.84, 1.0), uDark);
    col = mix(col, rim, fresnel * mix(0.4, 0.6, uDark));

    vec3 key = normalize(vec3(-0.5, 0.8, 0.6));
    vec3 fill = normalize(vec3(0.7, -0.4, 0.5));
    float spec = pow(max(dot(n, normalize(key + v)), 0.0), 70.0)
               + 0.35 * pow(max(dot(n, normalize(fill + v)), 0.0), 30.0);
    // The highlight softens once the blob is behind content.
    col += spec * mix(0.9, 0.75, uDark) * (1.0 - 0.6 * min(uScroll, 1.0));

    gl_FragColor = vec4(dither(col), 1.0);
  }
`;

/**
 * Parses a hex colour (#rgb, #rgba, #rrggbb, #rrggbbaa) or "rgb(a)(r, g, b, a)"
 * into 0..1 components. The build's CSS minifier rewrites rgba() as 8-digit hex,
 * so both forms reach this at runtime.
 */
function parseColor(value: string): [number, number, number, number] {
  const v = value.trim();
  if (v.startsWith('#')) {
    let hex = v.slice(1);
    if (hex.length <= 4) hex = [...hex].map(c => c + c).join('');
    const channel = (i: number) => parseInt(hex.slice(i * 2, i * 2 + 2), 16) / 255;
    return [channel(0), channel(1), channel(2), hex.length === 8 ? channel(3) : 1];
  }
  const [r = 0, g = 0, b = 0, a = 1] = (v.match(/[\d.]+/g) ?? []).map(Number);
  return [r / 255, g / 255, b / 255, a];
}

export function createScene(canvas: HTMLCanvasElement): () => void {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 20);
  camera.position.z = CAMERA_Z;

  // Current values ease toward the theme's targets, so a theme switch cross-fades.
  const target = {
    bg: new Vector3(),
    field: [new Vector4(), new Vector4(), new Vector4(), new Vector4()],
    dark: 0,
  };
  const uniforms = {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uRes: { value: new Vector2(1, 1) },
    uBg: { value: new Vector3() },
    uField: { value: [new Vector4(), new Vector4(), new Vector4(), new Vector4()] },
    uDark: { value: 0 },
  };

  const readTheme = (snap: boolean) => {
    const css = getComputedStyle(root);
    const [r, g, b] = parseColor(css.getPropertyValue('--bg'));
    target.bg.set(r, g, b);
    target.field.forEach((f, i) => f.set(...parseColor(css.getPropertyValue(`--field-${i + 1}`))));
    target.dark = root.getAttribute('data-theme') === 'dark' ? 1 : 0;
    if (snap) easeTheme(1);
  };

  const easeTheme = (k: number) => {
    uniforms.uBg.value.lerp(target.bg, k);
    uniforms.uField.value.forEach((f, i) => f.lerp(target.field[i], k));
    uniforms.uDark.value += (target.dark - uniforms.uDark.value) * k;
  };

  // Full-screen triangle for the field.
  const fieldGeometry = new BufferGeometry();
  fieldGeometry.setAttribute('position', new BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
  const fieldMaterial = new ShaderMaterial({
    uniforms,
    vertexShader: FIELD_VERT,
    fragmentShader: FIELD_FRAG,
    depthTest: false,
    depthWrite: false,
  });
  const field = new Mesh(fieldGeometry, fieldMaterial);
  field.frustumCulled = false;
  field.renderOrder = -1;
  scene.add(field);

  const blobGeometry = new IcosahedronGeometry(1, 24);
  const blobMaterial = new ShaderMaterial({ uniforms, vertexShader: BLOB_VERT, fragmentShader: BLOB_FRAG });
  const blob = new Mesh(blobGeometry, blobMaterial);
  blob.frustumCulled = false;
  scene.add(blob);

  const halfHeight = CAMERA_Z * Math.tan((FOV * Math.PI) / 360);
  let aspect = 1;
  let viewportHeight = 1;
  const pointer = new Vector2();
  const blobTarget = new Vector3();
  let scaleTarget = 1;

  /** Where the blob wants to be for the current scroll position. */
  const place = () => {
    const halfWidth = halfHeight * aspect;
    const narrow = aspect < 1;
    // Screens scrolled. Under reduced motion the blob stays where the hero put it.
    const s = reducedMotion.matches ? 0 : window.scrollY / viewportHeight;
    uniforms.uScroll.value = s;

    // In the hero it stands beside the name; past it, it retreats to the right
    // edge and drifts up and down there, clear of the left-aligned headings.
    const past = Math.min(s, 1);
    const reach = (narrow ? 0.95 : 0.52) + past * (narrow ? 0.2 : 0.48);
    scaleTarget = (narrow ? 0.62 : 1) * (1 - 0.15 * past);
    blobTarget.set(
      halfWidth * reach,
      halfHeight * ((narrow ? 0.55 : 0.04) * (1 - past) + 0.3 * Math.sin(s * 1.3)),
      0,
    );
  };

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return;
    aspect = width / height;
    viewportHeight = height;
    renderer.setSize(width, height, false);
    renderer.getDrawingBufferSize(uniforms.uRes.value);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    place();
  };

  let frame = 0;
  let last = performance.now();

  const render = (now: number) => {
    frame = 0;
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    const still = reducedMotion.matches;

    if (still) {
      easeTheme(1);
      blob.position.copy(blobTarget);
      blob.scale.setScalar(scaleTarget);
    } else {
      uniforms.uTime.value += dt;
      easeTheme(1 - Math.exp(-dt * 6));
      const k = 1 - Math.exp(-dt * 3.5);
      blob.position.x += (blobTarget.x + pointer.x * 0.18 - blob.position.x) * k;
      blob.position.y += (blobTarget.y + pointer.y * 0.18 - blob.position.y) * k;
      blob.scale.setScalar(blob.scale.x + (scaleTarget - blob.scale.x) * k);
      blob.rotation.y += (pointer.x * 0.5 - blob.rotation.y) * k + dt * 0.05;
      blob.rotation.x += (-pointer.y * 0.4 - blob.rotation.x) * k;
    }

    renderer.render(scene, camera);
    // Animated: keep going. Reduced motion: draw only when something changes.
    if (!still) schedule();
  };

  const schedule = () => {
    if (frame === 0 && !document.hidden) {
      last = performance.now();
      frame = requestAnimationFrame(render);
    }
  };

  const onPointer = (e: PointerEvent) => {
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, 1 - (e.clientY / window.innerHeight) * 2);
  };
  const onScroll = () => {
    place();
    schedule();
  };
  const onResize = () => {
    resize();
    schedule();
  };
  const onLost = (e: Event) => e.preventDefault();

  const themeObserver = new MutationObserver(() => {
    readTheme(false);
    schedule();
  });
  themeObserver.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', onScroll);
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', schedule);

  readTheme(true);
  resize();
  blob.position.copy(blobTarget);
  blob.scale.setScalar(scaleTarget);
  // Draw the first frame now, so the canvas can fade in already painted.
  render(performance.now());

  return () => {
    cancelAnimationFrame(frame);
    themeObserver.disconnect();
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', schedule);
    reducedMotion.removeEventListener('change', onScroll);
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', schedule);
    fieldGeometry.dispose();
    fieldMaterial.dispose();
    blobGeometry.dispose();
    blobMaterial.dispose();
    renderer.dispose();
  };
}
