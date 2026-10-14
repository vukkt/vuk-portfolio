import { portfolio } from '../data/portfolio';
import { ThemeToggle } from './ThemeProvider';
import './Nav.css';

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export function Nav() {
  return (
    <header className="nav">
      <nav className="nav__bar glass" aria-label="Main">
        <a href="#top" className="nav__brand">{portfolio.identity.name}</a>
        <ul className="nav__links">
          {LINKS.map(link => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </nav>
    </header>
  );
}
