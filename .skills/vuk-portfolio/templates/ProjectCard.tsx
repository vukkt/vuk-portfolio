// Reference template — drop into src/components/ProjectCard.tsx

import { Project } from '../data/portfolio';
import './ProjectCard.css';

interface Props {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: Props) {
  const num = String(index + 1).padStart(2, '0');
  const hasLinks = Object.keys(project.links).length > 0;

  return (
    <article className="project-card">
      <header className="project-card__header">
        <span className="project-card__num">{num}</span>
        <span className={`project-card__status project-card__status--${project.status}`}>
          [{project.status}]
        </span>
      </header>

      <h3 className="project-card__name">{project.name}</h3>
      <p className="project-card__tagline">{project.tagline}</p>

      <p className="project-card__description">{project.description}</p>

      <div className="project-card__meta">
        <span className="project-card__role-label">role &gt;</span>{' '}
        <span className="project-card__role">{project.role}</span>
      </div>

      <ul className="project-card__stack">
        {project.stack.map(tech => (
          <li key={tech} className="project-card__tag">[{tech}]</li>
        ))}
      </ul>

      {hasLinks && (
        <div className="project-card__links">
          {Object.entries(project.links).map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer">
              {label} &nearr;
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
