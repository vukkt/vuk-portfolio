import { portfolio } from '../data/portfolio';
import { useReveal } from '../hooks/useReveal';
import './Experience.css';

export function Experience() {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="experience" ref={ref} className="section container reveal">
      <div className="section-header">
        <p className="section-eyebrow">Experience</p>
        <h2 className="section-title">Where I’ve worked.</h2>
      </div>

      <ol className="experience__list">
        {portfolio.experience.map(job => {
          const detailed = job.highlights.length > 0;
          return (
            <li key={job.id} className={`experience__entry glass${detailed ? '' : ' experience__entry--compact'}`}>
              <div className="experience__aside">
                {job.period && <p className="experience__period">{job.period}</p>}
                {job.location && <p className="experience__location">{job.location}</p>}
              </div>
              <div className="experience__body">
                <h3 className="experience__role">
                  {job.role}
                  <span className="experience__company">{job.company}</span>
                </h3>
                {job.summary && <p className="experience__summary">{job.summary}</p>}
                {detailed && (
                  <ul className="experience__highlights">
                    {job.highlights.map(h => {
                      const [name, ...rest] = h.split(': ');
                      const detail = rest.join(': ');
                      return rest.length > 0 ? (
                        <li key={h}>
                          <strong>{name}</strong>
                          {detail.charAt(0).toUpperCase() + detail.slice(1)}
                        </li>
                      ) : (
                        <li key={h}>{h}</li>
                      );
                    })}
                  </ul>
                )}
                {job.stack.length > 0 && (
                  <ul className="chip-list experience__stack">
                    {job.stack.map(tech => (
                      <li key={tech} className="chip">{tech}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
