import { useEffect, useRef } from 'react';
import './Scene.css';

/**
 * The three.js layer behind the page. It loads after first paint, off the
 * main bundle; until then (and if WebGL is unavailable) the CSS `.backdrop`
 * underneath shows the same colour field.
 */
export function Scene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    let dispose: (() => void) | undefined;
    let cancelled = false;

    const start = () => {
      import('../scene/scene')
        .then(({ createScene }) => {
          if (cancelled) return;
          dispose = createScene(canvas);
          canvas.classList.add('is-ready');
        })
        .catch(() => {
          /* No WebGL or the chunk failed to load: the CSS backdrop stays. */
        });
    };

    const idle = 'requestIdleCallback' in window;
    const handle = idle ? window.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 200);

    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      dispose?.();
    };
  }, []);

  return <canvas ref={ref} className="scene" aria-hidden="true" />;
}
