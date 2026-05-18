import { portfolio } from '../data/portfolio';
import { ThemeToggle } from './ThemeProvider';
import './Nav.css';

export function Nav() {
  return (
    <nav className="nav">
      <div className="container nav__inner">
        <a href="#" className="nav__brand">{portfolio.identity.handle}</a>
        <ul className="nav__links">
          <li><a href="#about">about</a></li>
          <li><a href="#stack">stack</a></li>
          <li><a href="#experience">experience</a></li>
          <li><a href="#projects">projects</a></li>
          <li><a href="#contact">contact</a></li>
        </ul>
        <ThemeToggle />
      </div>
    </nav>
  );
}
