import { useEffect, useRef } from 'react';
import { portfolio } from '../data/portfolio';
import './Contact.css';

export function Contact() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { identity } = portfolio;

  return (
    <section id="contact" ref={ref} className="contact section fade-section">
      <div className="container">
        <p className="section-label">06 / contact</p>
        <div className="contact__body">
          <p className="contact__prompt">&gt; available for senior remote contracts</p>
          <div className="contact__links">
            <a href={identity.links.email} className="contact__link">
              <span className="contact__link-label">email</span>
              <span>{identity.email}</span>
            </a>
            <a href={identity.links.github} target="_blank" rel="noopener noreferrer" className="contact__link">
              <span className="contact__link-label">github</span>
              <span>github.com/{identity.handle}</span>
            </a>
            <a href={identity.links.linkedin} target="_blank" rel="noopener noreferrer" className="contact__link">
              <span className="contact__link-label">linkedin</span>
              <span>linkedin.com/in/vuktopalovic</span>
            </a>
          </div>
          <p className="contact__location">{identity.location}</p>
        </div>
      </div>
    </section>
  );
}
