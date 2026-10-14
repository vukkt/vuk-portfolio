import type { Project } from '../data/portfolio';
import { STATUS_LABELS } from './project-labels';
import './ProjectCard.css';


const LINK_LABELS: Record<string, string> = {
  github: 'GitHub',
  npm: 'npm',
  live: 'Website',
  demo: 'Demo',
};

export function ProjectLinks({ links }: { links: Project['links'] }) {
  const entries = Object.entries(links);
  if (entries.length === 0) return null;
  return (
    <div className="project-links">
      {entries.map(([key, url]) => (
        <a key={key} className="text-link" href={url} target="_blank" rel="noopener noreferrer">
          {LINK_LABELS[key] ?? key}
          <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}

interface Props {
  project: Project;
  large?: boolean;
}

export function ProjectCard({ project, large = false }: Props) {
  return (
    <article className={`project-card glass${large ? ' project-card--large' : ''}`}>
      <p className="project-card__kind">{STATUS_LABELS[project.status]}</p>
      <h3 className="project-card__name">{project.name}</h3>
      <p className="project-card__tagline">{project.tagline}</p>

      {project.steps && project.steps.length > 0 && (
        <ol className="project-card__steps" aria-label="How it works">
          {project.steps.map((step, i) => (
            <li key={step}>
              <span className="project-card__step-index">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      )}

      {project.image && (
        <img
          className="project-card__image"
          src={`${import.meta.env.BASE_URL}${project.image}`}
          alt={project.imageAlt ?? ''}
          width={960}
          height={669}
          loading="lazy"
          decoding="async"
        />
      )}

      <p className="project-card__description">{project.description}</p>

      {project.facts && project.facts.length > 0 && (
        <ul className="project-card__facts">
          {project.facts.map(fact => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      )}

      <div className="project-card__footer">
        {project.stack.length > 0 && (
          <ul className="chip-list">
            {project.stack.map(tech => (
              <li key={tech} className="chip">{tech}</li>
            ))}
          </ul>
        )}
        <div className="project-card__meta">
          <span className="project-card__role">{project.role}</span>
          <ProjectLinks links={project.links} />
        </div>
      </div>
    </article>
  );
}
