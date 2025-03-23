import React, { useState, useEffect } from 'react';
import './Block.css';

interface PawnPainterBlocksProps {
  title: string;
  description: string;
  icon: string;
  linkId: string;
  onClick?: () => void;
}

const PawnPainterBlocks: React.FC<PawnPainterBlocksProps> = ({ title, description, icon, linkId, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);

    if (onClick) {
      onClick();
      return;
    }

    if (linkId.startsWith('#')) {
      document.getElementById(linkId.substring(1))?.scrollIntoView({ behavior: 'smooth' });
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

  let className = 'block';
  if (isHovered) className += ' hovered';
  if (isClicked) className += ' clicked';

  return (
    <div
      className={className}
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

export default PawnPainterBlocks;