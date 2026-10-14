import { portfolio } from '../data/portfolio';
import { useReveal } from '../hooks/useReveal';
import './Contact.css';

export function Contact() {
  const ref = useReveal<HTMLElement>();
  const { identity } = portfolio;

  return (
    <section id="contact" ref={ref} className="section container reveal">
      <div className="contact glass">
        <p className="section-eyebrow">Contact</p>
        <h2 className="section-title">Have a project in mind?</h2>
        <p className="section-lede">
          {identity.status}. Email is the quickest way to reach me.
        </p>
        <a href={identity.links.email} className="contact__email">{identity.email}</a>
        <div className="contact__links">
          <a href={`${import.meta.env.BASE_URL}cv/Vuk_Topalovic_CV.pdf`} target="_blank" rel="noopener" className="button button--glass">
            CV (PDF)
          </a>
          <a href={identity.links.github} target="_blank" rel="noopener noreferrer" className="button button--glass">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a href={identity.links.linkedin} target="_blank" rel="noopener noreferrer" className="button button--glass">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
