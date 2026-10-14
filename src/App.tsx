import { Analytics } from '@vercel/analytics/react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { About } from './components/About';
import { Contact } from './components/Contact';

export default function App() {
  return (
    <>
      <div className="backdrop" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <About />
        <Contact />
      </main>
      <footer className="site-footer container">
        <span>© {new Date().getFullYear()} Vuk Topalovic</span>
        <span>Belgrade, Serbia</span>
      </footer>
      <Analytics />
    </>
  );
}
