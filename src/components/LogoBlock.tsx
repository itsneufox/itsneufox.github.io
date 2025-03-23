import React, { useState, useRef, useEffect } from 'react';
import './LogoBlock.css';
import { useTheme } from '../context/ThemeContext';
import crackSound from '../assets/cracked.mp3';

const LogoBlock: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentGreeting, setCurrentGreeting] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [isCracked, setIsCracked] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
 
  const greetings = [
    "Hello,", "Olá,", "Bonjour,", "Hola,", "Ciao,", "Hallo,", "こんにちは,",
    "안녕하세요,", "你好,", "Привет,", "Salut,", "नमस्ते,",
    "สวัสดี,", "Xin chào,", "مرحبا,", "Kamusta,", "Hej,", "Cześć,", "שלום,",
    "Salam,", "Jambo,", "Kia ora,", "Bună,", "Merhaba,", "Sawubona,",
    "Ayubowan,", "Zdravo,", "Góðan dag,", "Сәлем,", "Dia dhuit,",
    "Tere,", "Hej,", "Ahoj,", "Bongu,", "Sawasdee,", "Kumusta,", "Hafa Adai,",
    "Mogethin,", "Yokwe,", "Aloha,", "Talofa,", "Malo e lelei,", "Namaste,",
    "Selamat,", "Dumela,", "Mbote,", "Dobrý deň,", "Grüezi,"
  ];
 
  const handleClick = () => {
    setIsClicked(true);
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    if (newClickCount >= 15 && !isCracked) {
      setIsCracked(true);
      const audio = new Audio(crackSound);
      audio.play().catch(error => {
        console.error("Error playing sound:", error);
      });
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
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setCurrentGreeting((prev) => (prev + 1) % greetings.length);
        setIsAnimating(true);
      }, 500);
    }, 3000);
   
    return () => clearInterval(interval);
  }, [greetings.length]);
 
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!blockRef.current) return;
     
      const rect = blockRef.current.getBoundingClientRect();
     
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
     
      setMousePosition(prev => ({
        x: prev.x + (x - prev.x) * 0.1,
        y: prev.y + (y - prev.y) * 0.1
      }));
    };
   
    document.addEventListener('mousemove', handleGlobalMouseMove);
   
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, []);
 
  return (
    <div
      ref={blockRef}
      className={`logo-block-container ${isHovered ? 'hovered' : ''} ${isClicked ? 'clicked' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div
        className="logo-block-bg"
        style={{
          backgroundPosition: `calc(50% + ${mousePosition.x}px) calc(50% + ${mousePosition.y}px)`
        }}
      ></div>
     
      <div className={`logo-block-glass ${isCracked ? 'cracked' : ''}`}></div>
      
      {isCracked && <div className="glass-cracks"></div>}
     
      <div className="logo-block">
        <button
          className="logo-theme-toggle"
          onClick={(e) => {
            e.stopPropagation();
            toggleTheme();
          }}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className="toggle-icon">
            {theme === 'dark' ? '☀️' : '🌙'}
          </span>
          <span className="toggle-text">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
       
        <div className="logo-content">
          <div className="logo-text-container">
            <div className={`greeting ${isAnimating ? 'visible' : 'hidden'}`}>
              {greetings[currentGreeting]}
            </div>
            <h1 className="logo-text">i'm itsneufox</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoBlock;