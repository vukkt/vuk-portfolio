import { useEffect, useRef } from 'react';
import { portfolio } from '../data/portfolio';
import './Stack.css';

export function Stack() {
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
    <section id="stack" ref={ref} className="stack section fade-section">
      <div className="container">
        <p className="section-label">02 / stack</p>
        <div className="stack__groups">
          {portfolio.stack.map(group => (
            <div key={group.category} className="stack__group">
              <span className="stack__category">{group.category}</span>
              <ul className="stack__chips">
                {group.items.map(item => (
                  <li key={item} className="stack__chip">[{item}]</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
