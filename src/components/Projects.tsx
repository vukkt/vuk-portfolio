import { portfolio } from '../data/portfolio';
import { useReveal } from '../hooks/useReveal';
import { ProjectCard, ProjectLinks } from './ProjectCard';
import { STATUS_LABELS } from './project-labels';
import './Projects.css';

/** The first two featured projects get the wide cards. */
const LARGE_COUNT = 2;

export function Projects() {
  const ref = useReveal<HTMLElement>(0.04);
  const featured = portfolio.projects.filter(p => p.featured);
  const more = portfolio.projects.filter(p => !p.featured);

  return (
    <section id="work" ref={ref} className="section container reveal">
      <div className="section-header">
        <p className="section-eyebrow">Work</p>
        <h2 className="section-title">Selected projects.</h2>
        <p className="section-lede">
          Open-source tools I build and maintain, and EU platforms I work on at European Dynamics.
        </p>
      </div>

      <div className="projects__grid">
        {featured.map((project, i) => (
          <ProjectCard key={project.id} project={project} large={i < LARGE_COUNT} />
        ))}
      </div>

      {more.length > 0 && (
        <div className="projects__more">
          <h3 className="projects__more-title">More projects</h3>
          <ul className="projects__list glass">
            {more.map(project => (
              <li key={project.id} className="projects__row">
                <div className="projects__row-main">
                  <span className="projects__row-name">{project.name}</span>
                  <span className="projects__row-kind">{STATUS_LABELS[project.status]}</span>
                </div>
                <p className="projects__row-tagline">{project.tagline}</p>
                <ProjectLinks links={project.links} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
