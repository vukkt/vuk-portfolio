// Reference template — drop into src/components/Hero.tsx
// Reads from generated portfolio.ts data module.

import { useEffect, useState } from 'react';
import { portfolio } from '../data/portfolio';
import './Hero.css';

export function Hero() {
  const { hero, identity } = portfolio;
  const [typedTitle, setTypedTitle] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  // typed-in effect for hero title
  useEffect(() => {
    if (typedTitle.length < hero.title.length) {
      const timeout = setTimeout(() => {
        setTypedTitle(hero.title.slice(0, typedTitle.length + 1));
      }, 40);
      return () => clearTimeout(timeout);
    }
  }, [typedTitle, hero.title]);

  // cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div className="container">
        <div className="hero__label">> ~/{identity.handle}</div>

        <h1 className="hero__title">
          {typedTitle}
          <span className={`hero__cursor ${cursorVisible ? 'visible' : ''}`}>_</span>
        </h1>

        <div className="hero__subtitle">{hero.subtitle}</div>

        <div className="hero__pillars">
          {hero.pillars.map((pillar, i) => (
            <span key={pillar} className="hero__pillar">
              {pillar}
              {i < hero.pillars.length - 1 && <span className="hero__pillar-sep"> | </span>}
            </span>
          ))}
        </div>

        <p className="hero__intro">{hero.intro}</p>

        <div className="hero__status">
          <span className="hero__status-dot" />
          {identity.status}
        </div>
      </div>
    </section>
  );
}
