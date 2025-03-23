import React, { useState, useEffect } from 'react';
import './Block.css';

interface BlockProps {
  title: string;
  description: string;
  icon: string;
  link: string;
}

const Block: React.FC<BlockProps> = ({ title, description, icon, link }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  const handleClick = () => {
    setIsClicked(true);
    window.open(link, '_blank', 'noopener,noreferrer');
  };
  
  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => {
        setIsClicked(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isClicked]);
  
  return (
    <div 
      className={`block ${isHovered ? 'hovered' : ''} ${isClicked ? 'clicked' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="block-icon">
        <i className={`icon-${icon}`}></i>
      </div>
      <h3 className="block-title">{title}</h3>
      <p className="block-description">{description}</p>
    </div>
  );
};

export default Block;