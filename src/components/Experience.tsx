import { portfolio } from '../data/portfolio';
import { useReveal } from '../hooks/useReveal';
import './Experience.css';

/** One row per role. The per-project detail lives in Work and in the CV. */
export function Experience() {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="experience" ref={ref} className="section container reveal">
      <div className="section-header">
        <p className="section-eyebrow">Experience</p>
        <h2 className="section-title">Where I’ve worked.</h2>
      </div>

      <ol className="experience__list glass">
        {portfolio.experience.map(job => (
          <li key={job.id} className="experience__entry">
            <div className="experience__aside">
              <p className="experience__period">{job.period}</p>
              <p className="experience__location">{job.location}</p>
            </div>
            <div className="experience__body">
              <h3 className="experience__role">
                {job.role}
                <span className="experience__company">{job.company}</span>
              </h3>
              {job.summary && <p className="experience__summary">{job.summary}</p>}
              {job.stack.length > 0 && (
                <ul className="chip-list experience__stack">
                  {job.stack.map(tech => (
                    <li key={tech} className="chip">{tech}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
