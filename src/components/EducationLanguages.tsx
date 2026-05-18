import { useEffect, useRef } from 'react';
import { portfolio } from '../data/portfolio';
import './EducationLanguages.css';

export function EducationLanguages() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="education" ref={ref} className="edu-lang section fade-section">
      <div className="container">
        <p className="section-label">05 / education + languages</p>
        <div className="edu-lang__grid">
          <div className="edu-lang__col">
            {portfolio.education.map((edu, i) => (
              <div key={i} className="edu-lang__entry">
                <span className="edu-lang__title">{edu.title}</span>
                <span className="edu-lang__institution">{edu.institution}</span>
                <span className="edu-lang__period">{edu.period}</span>
              </div>
            ))}
          </div>
          <div className="edu-lang__col">
            {portfolio.languages.map(lang => (
              <div key={lang.name} className="edu-lang__entry">
                <span className="edu-lang__title">{lang.name}</span>
                <span className="edu-lang__period">{lang.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
