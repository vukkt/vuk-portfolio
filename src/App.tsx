import { Analytics } from '@vercel/analytics/react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Stack } from './components/Stack';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { EducationLanguages } from './components/EducationLanguages';
import { Contact } from './components/Contact';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Stack />
        <Experience />
        <Projects />
        <EducationLanguages />
        <Contact />
        <footer className="site-footer container">
          <span>© 2026 Vuk Topalovic</span>
          <span className="site-footer__handle">~/vukkt</span>
        </footer>
      </main>
      <Analytics />
    </>
  );
}
