import { CSSProperties, PointerEvent, useLayoutEffect } from 'react';
import { FiSun, FiMoon, FiTruck, FiType, FiMessageSquare, FiDroplet } from 'react-icons/fi';
import { HashRouter, Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Signals from './components/Signals';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const projects = [
  { name: 'Discord Bridge', description: 'Discord commands, messages, and interactions from PAWN.', type: 'Plugin', icon: FiMessageSquare, tone: 'bridge', href: 'https://github.com/itsneufox/omp-Discord-Bridge' },
  { name: 'GameText Plus', description: 'An improved GameText system for open.mp.', type: 'Library', icon: FiType, tone: 'gametext', href: 'https://github.com/itsneufox/GameText-Plus' },
  { name: 'PAWN Painter', description: 'Colour previews for PAWN in VS Code.', type: 'Extension', icon: FiDroplet, tone: 'painter', href: 'https://marketplace.visualstudio.com/items?itemName=itsneufox.pawn-painter' },
  { name: 'LongWayDrivers', description: 'A trucking server for open.mp.', type: 'Server', icon: FiTruck, tone: 'drivers', href: 'https://github.com/longwaydrivers' },
];

function trackProjectPointer(event: PointerEvent<HTMLAnchorElement>) {
  if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
  event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
}

function PortfolioHome() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="app portfolio-page">
      <div className="site-shell">
        <header className="site-header">
          <div className="brand-cluster"><button className="brand-mark" type="button" aria-label="Animate mark" onClick={() => window.dispatchEvent(new Event('site:mark'))}><span className="brand-spark" aria-hidden="true">✳</span></button><Link className="brand" to="/">itsneufox</Link></div>
          <button className="theme-button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? FiSun({ 'aria-hidden': true }) : FiMoon({ 'aria-hidden': true })}
            {theme === 'dark' ? 'Light theme' : 'Dark theme'}
          </button>
        </header>
        <main className="profile-layout">
          <section className="profile-intro" aria-labelledby="profile-title">
            <h1 id="profile-title">Hey, I'm<br /><span className="profile-name">itsneufox</span><span>.</span></h1>
            <p>I make tools and projects for PAWN and open.mp.</p>
            <a className="profile-github" href="https://github.com/itsneufox" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          </section>
          <section className="project-index" aria-labelledby="projects-title">
            <div className="project-list-heading"><h2 id="projects-title">Projects</h2></div>
            <div className="project-list">
              {projects.map((project, index) => {
                const Icon = project.icon;
                const rowStyle = { '--row-delay': `${index * 120 + 120}ms` } as CSSProperties;
                const content = <>
                  <span className="project-sheen" aria-hidden="true" />
                  <span className="project-icon" aria-hidden="true">{Icon({})}</span>
                  <div className="project-row-content">
                    <div className="project-row-heading"><h3>{project.name}</h3><span className="project-arrow" aria-hidden="true"><span>↗</span><span>↗</span></span></div>
                    <p>{project.description}</p>
                    <span className="project-type">{project.type}</span>
                  </div>
                </>;
                const className = `project-row project-${project.tone}`;
                return <div className="project-entry" style={rowStyle} key={project.name}>
                  <a className={className} href={project.href} target="_blank" rel="noopener noreferrer" onPointerMove={trackProjectPointer}>{content}</a>
                </div>;
              })}
            </div>
            <a className="all-projects" href="https://github.com/itsneufox?tab=repositories" target="_blank" rel="noopener noreferrer">All repositories <span aria-hidden="true">↗</span></a>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function RoutePosition() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previous;
  }, [pathname]);
  return null;
}

export default function App() {
  return <ThemeProvider><HashRouter><RoutePosition /><Routes><Route path="/" element={<PortfolioHome />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes><Signals /></HashRouter></ThemeProvider>;
}
