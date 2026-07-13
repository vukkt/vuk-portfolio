import type { Project } from '../data/portfolio';
import './ProjectCard.css';

interface Props {
  project: Project;
}

const STATUS_LABELS: Record<Project['status'], string> = {
  production: 'Production',
  personal: 'Open source',
  wip: 'In progress',
};

const LINK_LABELS: Record<string, string> = {
  github: 'GitHub',
  npm: 'npm',
  live: 'Live',
  demo: 'Demo',
};

export function ProjectCard({ project }: Props) {
  const links = Object.entries(project.links);
  const cardClass = project.featured
    ? 'project-card project-card--featured'
    : 'project-card';

  return (
    <article className={cardClass}>
      <header className="project-card__header">
        <h3 className="project-card__name">{project.name}</h3>
        <span
          className={`project-card__status project-card__status--${project.status}`}
        >
          {STATUS_LABELS[project.status]}
        </span>
      </header>

      <p className="project-card__tagline">{project.tagline}</p>
      <p className="project-card__description">{project.description}</p>

      <ul className="project-card__stack">
        {project.stack.map(tech => (
          <li key={tech} className="project-card__tag">
            {tech}
          </li>
        ))}
      </ul>

      <footer className="project-card__footer">
        <span className="project-card__role">{project.role}</span>
        {links.length > 0 && (
          <div className="project-card__links">
            {links.map(([label, url]) => (
              <a
                key={label}
                className="project-card__link"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {LINK_LABELS[label] ?? label}
                <span className="project-card__link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
        )}
      </footer>
    </article>
  );
}
