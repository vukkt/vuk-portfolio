import { useEffect, useRef } from 'react';
import { portfolio } from '../data/portfolio';
import './About.css';

export function About() {
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
    <section id="about" ref={ref} className="about section fade-section">
      <div className="container">
        <p className="section-label">01 / about</p>
        <div className="about__body">
          {portfolio.about.summary.map((para, i) => (
            <p key={i} className="about__para">{para}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
