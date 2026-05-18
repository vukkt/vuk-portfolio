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

  return (
    <section id="projects" ref={ref} className="projects section fade-section">
      <div className="container">
        <p className="section-label">04 / projects</p>
        <div className="projects__grid">
          {portfolio.projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
