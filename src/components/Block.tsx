import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Block.css';

interface BlockProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  onClick?: () => void;
}

const Block: React.FC<BlockProps> = ({ title, description, icon, link, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();
  
  const handleClick = () => {
    setIsClicked(true);
    
    if (onClick) {
      onClick();
      return;
    }
    
    if (link.startsWith('/')) {
      console.log("Attempting to navigate to:", link.substring(1));
      navigate(link.substring(1));
    } else if (link.startsWith('#')) {
      document.getElementById(link.substring(1))?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
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