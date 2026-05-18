import { useEffect, useRef } from 'react';
import { portfolio } from '../data/portfolio';
import './Experience.css';

export function Experience() {
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
    <section id="experience" ref={ref} className="experience section fade-section">
      <div className="container">
        <p className="section-label">03 / experience</p>
        <div className="experience__list">
          {portfolio.experience.map(job => (
            <article key={job.id} className="experience__entry">
              <header className="experience__header">
                <div className="experience__role-line">
                  <span className="experience__role">{job.role}</span>
                  <span className="experience__sep"> @ </span>
                  <span className="experience__company">{job.company}</span>
                </div>
                <div className="experience__meta">
                  <span>{job.period}</span>
                  <span>{job.location}</span>
                </div>
              </header>
              <p className="experience__summary">{job.summary}</p>
              <ul className="experience__highlights">
                {job.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
              <ul className="experience__stack">
                {job.stack.map(tech => (
                  <li key={tech} className="experience__tag">[{tech}]</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
