import { portfolio } from '../data/portfolio';
import './Hero.css';

export function Hero() {
  const { hero, identity } = portfolio;

  return (
    <section id="top" className="hero container">
      <div className="hero__main">
        <p className="hero__status">
          <span className="hero__status-dot" aria-hidden="true" />
          {identity.status}
        </p>
        <h1 className="hero__title">
          {hero.title}
          <span className="hero__subtitle">{hero.subtitle}</span>
        </h1>
        <p className="hero__intro">{hero.intro}</p>
        <div className="hero__actions">
          <a href="#work" className="button button--primary">See my work</a>
          <a href={identity.links.email} className="button button--glass">Email me</a>
        </div>
        <p className="hero__meta">
          <a href={`${import.meta.env.BASE_URL}cv/Vuk_Topalovic_CV.pdf`} target="_blank" rel="noopener" className="text-link">Download CV</a>
          <span aria-hidden="true"> · </span>
          <a href={identity.links.github} target="_blank" rel="noopener noreferrer" className="text-link">GitHub</a>
          <span aria-hidden="true"> · </span>
          <a href={identity.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-link">LinkedIn</a>
        </p>
      </div>

      <aside className="hero__glance glass" aria-label="At a glance">
        <dl>
          {hero.glance.map(item => (
            <div key={item.label} className="hero__glance-row">
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </section>
  );
}
