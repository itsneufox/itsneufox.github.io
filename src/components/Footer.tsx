import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <span>© {currentYear} itsneufox</span>
      <a href="https://github.com/itsneufox" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
    </footer>
  );
};

export default Footer;
