#!/usr/bin/env node
/**
 * build_cv.cjs — Render Vuk's CV from portfolio_content.json to HTML and PDF.
 *
 * The CV and the website read the same JSON, so they never drift apart.
 *
 * Usage:
 *   node .skills/vuk-portfolio/scripts/build_cv.cjs --out ~/Documents/CV/VukTopalovic_CV.pdf
 *   node .skills/vuk-portfolio/scripts/build_cv.cjs --out public/cv/Vuk_Topalovic_CV.pdf --public
 *
 *   --public   leave the phone number out (for the copy served from the website)
 *   --html     also keep the intermediate .html next to the PDF
 *
 * Needs Google Chrome (or set CHROME=/path/to/chrome).
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const args = process.argv.slice(2);
const getArg = (flag, def) => {
  const i = args.indexOf(flag);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : def;
};
const expand = p => (p.startsWith('~') ? path.join(os.homedir(), p.slice(1)) : p);

const isPublic = args.includes('--public');
const keepHtml = args.includes('--html');
const outPdf = path.resolve(expand(getArg('--out', 'VukTopalovic_CV.pdf')));
const chrome =
  process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'portfolio_content.json'), 'utf-8')
);
const { identity, cv, stack, experience, projects, education, languages } = data;

// ---------- helpers ----------
const esc = s =>
  String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const bare = url => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

/** "Name: detail" → bold name + detail, matching the website's highlight style. */
function highlight(h) {
  const i = h.indexOf(': ');
  if (i < 0) return esc(h);
  const detail = h.slice(i + 2);
  return `<strong>${esc(h.slice(0, i))}.</strong> ${esc(detail.charAt(0).toUpperCase() + detail.slice(1))}`;
}

// ---------- sections ----------
const contact = [
  esc(identity.location),
  `<a href="${esc(identity.links.email)}">${esc(identity.email)}</a>`,
  isPublic ? null : esc(identity.phone),
  `<a href="${esc(identity.links.linkedin)}">${esc(bare(identity.links.linkedin))}</a>`,
  `<a href="${esc(identity.links.github)}">${esc(bare(identity.links.github))}</a>`,
  `<a href="${esc(cv.website)}">${esc(bare(cv.website))}</a>`,
]
  .filter(Boolean)
  .map(item => `<span class="item">${item}</span>`)
  .join(' <span class="sep">·</span> ');

const skills = (cv.skills || stack)
  .map(g => `<div class="skill"><dt>${esc(g.category)}</dt><dd>${g.items.map(esc).join(', ')}</dd></div>`)
  .join('');

const jobs = experience
  .map(site => ({ ...site, highlights: (cv.highlights && cv.highlights[site.id]) || site.highlights }))
  .map(job => {
    const meta = [job.period, job.location].filter(Boolean).map(esc).join(' <span class="sep">·</span> ');
    const bullets = job.highlights.length
      ? `<ul>${job.highlights.map(h => `<li>${highlight(h)}</li>`).join('')}</ul>`
      : '';
    const tech = job.stack.length ? `<p class="tech">${job.stack.map(esc).join(' · ')}</p>` : '';
    const summary = job.summary && !job.highlights.length ? `<p class="summary">${esc(job.summary)}</p>` : '';
    const compact = job.highlights.length ? '' : ' compact';
    return `<article class="job${compact}">
      <header><h3>${esc(job.role)} <span class="org">${esc(job.company)}</span></h3><p class="meta">${meta}</p></header>
      ${summary}${bullets}${tech}
    </article>`;
  })
  .join('');

const projectRows = cv.projects
  .map(id => projects.find(p => p.id === id))
  .filter(Boolean)
  .map((p, i) => {
    const link = p.links.npm || p.links.github || p.links.live;
    const linkHtml = link ? `<a class="plink" href="${esc(link)}">${esc(bare(link))}</a>` : '';
    const heading = i === 0 ? '<h2>Selected projects</h2>' : '';
    return `<article class="project">${heading}
      <header><h3>${esc(p.name)}</h3>${linkHtml}</header>
      <p class="body">${esc((cv.projectBlurbs && cv.projectBlurbs[p.id]) || p.description)} <span class="tech-inline">${p.stack.map(esc).join(' · ')}</span></p>
    </article>`;
  })
  .join('');

const edu = education
  .map(e => `<li><span><strong>${esc(e.title)}</strong>, ${esc(e.institution)}</span><span class="when">${esc(e.period)}</span></li>`)
  .join('');
const langs = languages.map(l => `${esc(l.name)} (${esc(l.level.toLowerCase())})`).join(', ');

// ---------- document ----------
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="author" content="${esc(identity.name)}">
<title>${esc(identity.name)} · CV</title>
<style>
  @page { size: A4; margin: 11mm 14mm 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 9.1pt; line-height: 1.38; color: #1d1d1f; letter-spacing: -0.003em;
  }
  a { color: inherit; text-decoration: none; }
  .sep { color: #a1a1a6; margin: 0 0.15em; }

  .top { padding-bottom: 9pt; border-bottom: 1.5pt solid #0066cc; }
  h1 { font-family: -apple-system, 'SF Pro Display', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
       font-size: 23pt; font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; }
  .headline { margin-top: 3pt; font-size: 12.5pt; font-weight: 500; color: #0066cc; letter-spacing: -0.01em; }
  .contact { margin-top: 7pt; font-size: 8.8pt; color: #4f4f55; }
  .contact .item { white-space: nowrap; }

  section { margin-top: 8pt; }
  h2 { font-size: 8pt; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: #0066cc;
       margin-bottom: 4.5pt; }
  .lede { font-size: 9.4pt; color: #2c2c30; text-align: justify; }

  dl.skills { display: grid; grid-template-columns: 1fr; row-gap: 1.5pt; }
  .skill { display: grid; grid-template-columns: 38mm 1fr; }
  .skill dt { font-weight: 600; }
  .skill dd { color: #3a3a3f; }

  .job, .project { break-inside: avoid; }
  .job + .job { margin-top: 6pt; }
  .project + .project { margin-top: 5pt; }
  .job.compact + .job.compact { margin-top: 5pt; }
  header { display: flex; justify-content: space-between; align-items: baseline; gap: 10pt; }
  h3 { font-size: 9.9pt; font-weight: 650; letter-spacing: -0.01em; }
  .org { font-weight: 500; color: #4f4f55; }
  .org::before { content: '· '; color: #a1a1a6; }
  .meta, .plink, .when { flex: none; font-size: 8.8pt; color: #6e6e73; white-space: nowrap; }
  .summary { margin-top: 2pt; color: #3a3a3f; }
  ul { margin-top: 2.5pt; padding-left: 10pt; }
  li { margin-top: 1.5pt; color: #2c2c30; text-align: justify; }
  li::marker { color: #0066cc; }
  li strong { color: #1d1d1f; font-weight: 600; }
  .tech { margin-top: 2.5pt; font-size: 8.3pt; color: #6e6e73; }
  .tech-inline { font-size: 8.3pt; color: #6e6e73; }
  .project .body { margin-top: 1pt; color: #2c2c30; text-align: justify; }

  .edu { list-style: none; padding: 0; margin: 0; }
  .edu li { display: flex; justify-content: space-between; gap: 10pt; margin-top: 0; text-align: left; }
  .edu li + li { margin-top: 1.5pt; }
  .langs { margin-top: 0; color: #2c2c30; }
  .closing { display: grid; grid-template-columns: 1fr 64mm; gap: 10mm; }
</style>
</head>
<body>
  <div class="top">
    <h1>${esc(identity.name)}</h1>
    <p class="headline">${esc(cv.headline)}</p>
    <p class="contact">${contact}</p>
  </div>

  <section><h2>Profile</h2><p class="lede">${esc(cv.summary)}</p></section>
  <section><h2>Skills</h2><dl class="skills">${skills}</dl></section>
  <section><h2>Experience</h2>${jobs}</section>
  <section>${projectRows}</section>
  <div class="closing">
    <section><h2>Education</h2><ul class="edu">${edu}</ul></section>
    <section><h2>Languages</h2><p class="langs">${langs.replace(', ', '<br>')}</p></section>
  </div>
</body>
</html>
`;

// ---------- render ----------
fs.mkdirSync(path.dirname(outPdf), { recursive: true });
const htmlPath = keepHtml
  ? outPdf.replace(/\.pdf$/i, '.html')
  : path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'cv-')), 'cv.html');
fs.writeFileSync(htmlPath, html, 'utf-8');

execFileSync(
  chrome,
  ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${outPdf}`, `file://${htmlPath}`],
  { stdio: 'ignore' }
);

console.log(`✓ CV written: ${outPdf}${isPublic ? ' (public: no phone)' : ''}`);
if (keepHtml) console.log(`  HTML: ${htmlPath}`);
