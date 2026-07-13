import { useEffect, useRef } from 'react';
import { portfolio } from '../data/portfolio';
import { ProjectCard } from './ProjectCard';
import './Projects.css';

export function Projects() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const featured = portfolio.projects.filter(p => p.featured);
  const rest = portfolio.projects.filter(p => !p.featured);

  return (
    <section id="projects" ref={ref} className="projects section fade-section">
      <div className="container">
        <p className="section-label">04 / projects</p>

        {featured.length > 0 && (
          <div className="projects__tier">
            <p className="projects__tier-label">Featured</p>
            <div className="projects__grid projects__grid--featured">
              {featured.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {rest.length > 0 && (
          <div className="projects__tier">
            <p className="projects__tier-label">Production &amp; personal</p>
            <div className="projects__grid">
              {rest.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
