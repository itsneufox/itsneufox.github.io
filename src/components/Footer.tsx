import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="footer-text">
      <div>&copy; {currentYear} itsneufox</div>
      <div>Built with TypeScript & React</div>
    </div>
  );
};

export default Footer;