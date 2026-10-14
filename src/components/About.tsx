import { portfolio } from '../data/portfolio';
import { useReveal } from '../hooks/useReveal';
import './About.css';

export function About() {
  const ref = useReveal<HTMLElement>();
  const { about, stack, education, languages } = portfolio;

  return (
    <section id="about" ref={ref} className="section container reveal">
      <div className="section-header">
        <p className="section-eyebrow">About</p>
        <h2 className="section-title">How I work.</h2>
      </div>

      <div className="about__grid">
        <div className="about__text">
          {about.summary.map(para => (
            <p key={para}>{para}</p>
          ))}
        </div>

        <div className="about__stack glass">
          <h3 className="about__card-title">Tools I use</h3>
          <dl className="about__groups">
            {stack.map(group => (
              <div key={group.category} className="about__group">
                <dt>{group.category}</dt>
                <dd>
                  <ul className="chip-list">
                    {group.items.map(item => (
                      <li key={item} className="chip">{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="about__facts">
        <div className="about__fact glass">
          <h3 className="about__card-title">Education</h3>
          <ul>
            {education.map(edu => (
              <li key={edu.title} className="about__fact-row">
                <span className="about__fact-main">{edu.title}</span>
                <span className="about__fact-sub">{edu.institution}</span>
                <span className="about__fact-sub">{edu.period}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="about__fact glass">
          <h3 className="about__card-title">Languages</h3>
          <ul>
            {languages.map(lang => (
              <li key={lang.name} className="about__fact-row">
                <span className="about__fact-main">{lang.name}</span>
                <span className="about__fact-sub">{lang.level}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
