import React, { useState, useEffect, useRef } from 'react';
import './PawnPainter.css';
import Footer from './Footer';
import PawnPainterBlocks from './PawnPainterBlocks';
import { useTheme } from '../context/ThemeContext';
import crackSound from '../assets/cracked.mp3';

const PawnPainter: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  // Animation states for logo block
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentGreeting, setCurrentGreeting] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [isCracked, setIsCracked] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

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

  // Logo click handler
  const handleLogoClick = () => {
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

  // Click animation reset
  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => {
        setIsClicked(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isClicked]);

  // Greeting animation
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

  // Mouse parallax effect
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

  const handleBlockClick = (id: string) => {
    setActiveSection(id);
    // Smooth scroll to the content section if it's now visible
    setTimeout(() => {
      document.getElementById('guide')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'hexColors':
        return (
          <>
            <h3 className="content-subtitle">Hex Colour Visualization</h3>
            <p className="content-text">
              Instantly see the colours represented by hex values in your code - no more guessing what 0xFF0000FF actually looks like.
            </p>
            <div className="code-example">
              <pre>
                <code>
                  {`// Hex values come alive with visual highlighting
#define COLOR_RED        `}<span style={{ textDecoration: 'underline', textDecorationColor: '#FF0000' }}>0xFF0000FF</span>{`  // Clearly visible as red
#define COLOR_GREEN      `}<span style={{ textDecoration: 'underline', textDecorationColor: '#00FF00' }}>0x00FF00FF</span>{`  // Instantly recognized as green
#define COLOR_BLUE       `}<span style={{ textDecoration: 'underline', textDecorationColor: '#0000FF' }}>0x0000FFFF</span>{`  // Immediately identified as blue`}
                </code>
              </pre>
            </div>
            <div className="split-section">
              <div>
                <p className="content-text">
                  Supported hex formats:
                </p>
                <ul style={{ listStyle: 'none', paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                  <li style={{ marginBottom: '0.5rem' }}>• Standard 0xRRGGBB format</li>
                  <li style={{ marginBottom: '0.5rem' }}>• RGBA with alpha (0xRRGGBBAA)</li>
                  <li style={{ marginBottom: '0.5rem' }}>• Optional transparency warnings</li>
                </ul>
              </div>
              <div>
                <p className="content-text">
                  Use cases:
                </p>
                <ul style={{ listStyle: 'none', paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                  <li style={{ marginBottom: '0.5rem' }}>• Color definitions in headers</li>
                  <li style={{ marginBottom: '0.5rem' }}>• Dialog and UI development</li>
                  <li style={{ marginBottom: '0.5rem' }}>• Zone or area marker colors</li>
                </ul>
              </div>
            </div>
          </>
        );
      
      case 'gameText':
        return (
          <>
            <h3 className="content-subtitle">GameText Colour Preview</h3>
            <p className="content-text">
              See your ~r~, ~g~, ~b~ colour codes displayed exactly as they'll appear in-game - all within your editor.
            </p>
            <div className="code-example">
              <pre>
                <code>
                  {`// GameText colours appear as they will in-game
SendClientMessage(playerid, -1, "`}<span style={{ color: '#9C1719' }}>~r~Important error message</span>{`");
SendClientMessage(playerid, -1, "`}<span style={{ color: '#2E5926' }}>~g~Success notification</span>{`");

// Brightness modifiers work too
SendClientMessage(playerid, -1, "`}<span style={{ color: '#C4A657' }}>~y~Warning </span><span style={{ color: '#dbc980' }}>~y~~h~Important warning </span><span style={{ color: '#f2edac' }}>~y~~h~~h~Critical</span>{`");`}
                </code>
              </pre>
            </div>
            <p className="content-text">
              All standard GameText colours are supported, including the brightness modifier ~h~, which can be stacked for multiple brightness levels.
              Instantly see how your text will look, making UI design much more intuitive.
            </p>
          </>
        );
      
      case 'inlineColors':
        return (
          <>
            <h3 className="content-subtitle">Inline Colour Format</h3>
            <p className="content-text">
              Preview embedded {"{RRGGBB}"} colour codes in your strings - a format commonly used in SA-MP/open.mp servers.
            </p>
            <div className="code-example">
              <pre>
                <code>
                  {`// Inline colour codes display exactly as they'll appear in-game
SendClientMessage(playerid, -1, "`}<span style={{ textDecoration: 'underline', textDecorationColor: '#FF0000' }}>{'{FF0000}'}</span><span style={{ color: '#FF0000' }}>Error: </span><span style={{ textDecoration: 'underline', textDecorationColor: '#FFFFFF' }}>{'{FFFFFF}'}</span><span style={{ color: '#FFFFFF' }}>Invalid weapon ID</span>{`");
SendClientMessage(playerid, -1, "`}<span style={{ textDecoration: 'underline', textDecorationColor: '#00FF00' }}>{'{00FF00}'}</span><span style={{ color: '#00FF00' }}>Success: </span><span style={{ textDecoration: 'underline', textDecorationColor: '#FFFFFF' }}>{'{FFFFFF}'}</span><span style={{ color: '#FFFFFF' }}>Vehicle spawned</span>{`");

// Perfect for complex formatted messages
SendClientMessage(playerid, -1, "`}<span style={{ textDecoration: 'underline', textDecorationColor: '#FFFF00' }}>{'{FFFF00}'}</span><span style={{ color: '#FFFF00' }}>ADMIN: </span><span style={{ textDecoration: 'underline', textDecorationColor: '#FF0000' }}>{'{FF0000}'}</span><span style={{ color: '#FF0000' }}>John </span><span style={{ textDecoration: 'underline', textDecorationColor: '#FFFFFF' }}>{'{FFFFFF}'}</span><span style={{ color: '#FFFFFF' }}>has banned </span><span style={{ textDecoration: 'underline', textDecorationColor: '#FF0000' }}>{'{FF0000}'}</span><span style={{ color: '#FF0000' }}>Mike </span><span style={{ textDecoration: 'underline', textDecorationColor: '#FFFFFF' }}>{'{FFFFFF}'}</span><span style={{ color: '#FFFFFF' }}>for cheating</span>{`");`}
                </code>
              </pre>
            </div>
            <p className="content-text">
              PAWN Painter highlights both the colour code itself and the text that follows, giving you a perfect preview of how your messages will appear to players.
              Multiple colour codes in the same string are all properly visualized.
            </p>
          </>
        );
      
      case 'ignoreLines':
        return (
          <>
            <h3 className="content-subtitle">Selective Line Ignoring</h3>
            <p className="content-text">
              Need to disable highlighting for specific lines? PAWN Painter lets you selectively ignore any line with a simple right-click.
            </p>
            <div className="code-example">
              <pre>
                <code>
                  {`// Line with active colour highlighting
#define COLOR_RED       `}<span style={{ textDecoration: 'underline', textDecorationColor: '#FF0000' }}>0xFF0000FF</span>{`    // Highlighted with colour

// Line with colour highlighting disabled via right-click
#define COLOR_GREEN     0x00FF00FF    // No highlighting applied

// Highlighting can be restored at any time`}
                </code>
              </pre>
            </div>
            <p className="content-text">
              This feature is perfect for avoiding false positives or when you need to focus without visual distractions.
              Right-click on any line and select "Ignore Colour" to disable highlighting, or "Restore Colour" to bring it back.
            </p>
          </>
        );
      
      case 'styles':
        return (
          <>
            <h3 className="content-subtitle">Customizable Highlighting Styles</h3>
            <p className="content-text">
              PAWN Painter lets you choose how colours are displayed in your code with three distinct highlighting styles.
            </p>
            <div className="code-example">
              <pre>
                <code>
                  {`// Different highlighting styles for the same code
// Text style:`}
                  {`\n#define COLOR_RED       `}<span style={{ color: '#FF0000' }}>0xFF0000FF</span>

                  {`\n// Underline style (default):`}
                  {`\n#define COLOR_GREEN     `}<span style={{ textDecoration: 'underline', textDecorationColor: '#00FF00' }}>0x00FF00FF</span>

                  {`\n// Background style:`}
                  {`\n#define COLOR_BLUE      `}<span style={{ backgroundColor: 'rgba(0, 0, 255, 0.2)', padding: '0 3px', borderRadius: '3px' }}>0x0000FFFF</span>
                </code>
              </pre>
            </div>
            <div className="split-section">
              <div>
                <p className="content-text">
                  Available styles:
                </p>
                <ul style={{ listStyle: 'none', paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                  <li style={{ marginBottom: '0.5rem' }}>• Text - changes the colour of the text itself</li>
                  <li style={{ marginBottom: '0.5rem' }}>• Underline - adds a coloured underline (default)</li>
                  <li style={{ marginBottom: '0.5rem' }}>• Background - adds a subtle coloured background</li>
                </ul>
              </div>
              <div>
                <p className="content-text">
                  Style configurations:
                </p>
                <ul style={{ listStyle: 'none', paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                  <li style={{ marginBottom: '0.5rem' }}>• Each feature has its own style setting</li>
                  <li style={{ marginBottom: '0.5rem' }}>• Customize via VS Code settings</li>
                  <li style={{ marginBottom: '0.5rem' }}>• Changes apply immediately</li>
                </ul>
              </div>
            </div>
            <p className="content-text">
              Choose the style that works best for your theme and coding preferences. Each highlighting feature 
              (hex colours, GameText, inline colours) can have its own style setting for maximum flexibility.
            </p>
          </>
        );
      
      case 'download':
        return (
          <>
            <h3 className="content-subtitle">Download and Installation</h3>
            <p className="content-text">
              PAWN Painter is available for free on the Visual Studio Code Marketplace and takes just seconds to install.
            </p>
            <p className="content-text">
              After installation, PAWN Painter automatically activates for .pwn and .inc files, with no configuration required.
              Customization options are available in the VS Code settings if you want to adjust the highlighting style.
            </p>

            <div className="button-container">
              <a href="https://marketplace.visualstudio.com/items?itemName=itsneufox.pawn-painter" className="cta-button" target="_blank" rel="noopener noreferrer">
                Download Extension
              </a>
              <a href="https://github.com/itsneufox/PAWN-Painter-VSC" className="cta-button" style={{ backgroundColor: '#333' }} target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
              <a href="https://ko-fi.com/itsneufox" className="cta-button" style={{ backgroundColor: '#29abe0' }} target="_blank" rel="noopener noreferrer">
                Support on Ko-fi
              </a>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="app pawn-painter-page">
      <div className="blocks-container">
        {/* Logo Block - updated with all animations from LogoBlock */}
        <div
          ref={blockRef}
          className={`painter-logo-block-container ${isHovered ? 'hovered' : ''} ${isClicked ? 'clicked' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleLogoClick}
        >
          <div
            className="painter-logo-block-bg"
            style={{
              backgroundPosition: `calc(50% + ${mousePosition.x}px) calc(50% + ${mousePosition.y}px)`
            }}
          ></div>

          <div className={`painter-logo-block-glass ${isCracked ? 'cracked' : ''}`}></div>

          {isCracked && <div className="glass-cracks"></div>}

          <div className="painter-logo-block">
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

            <div className="painter-logo-content">
              <div className="painter-logo-text-container">
                <div className={`greeting ${isAnimating ? 'visible' : 'hidden'}`}>
                  {greetings[currentGreeting]}
                </div>
                <h1 className="painter-logo-title">I'm PAWN <span className="rainbow-text">Painter</span></h1>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Blocks - using the new PawnPainterBlocks component */}
        <PawnPainterBlocks
          title="Hex Colours"
          description="Visualize hex codes at a glance"
          icon="palette"
          linkId="hexColors"
          onClick={() => handleBlockClick('hexColors')}
        />

        <PawnPainterBlocks
          title="GameText"
          description="Preview SA-MP colour codes in strings"
          icon="text"
          linkId="gameText"
          onClick={() => handleBlockClick('gameText')}
        />

        <PawnPainterBlocks
          title="Inline Format"
          description="See {RRGGBB} colours in action"
          icon="braces"
          linkId="inlineColors"
          onClick={() => handleBlockClick('inlineColors')}
        />

        <PawnPainterBlocks
          title="Ignore Lines"
          description="Skip highlighting where needed"
          icon="select"
          linkId="ignoreLines"
          onClick={() => handleBlockClick('ignoreLines')}
        />

        <PawnPainterBlocks
          title="Custom Styles"
          description="Choose your preferred style"
          icon="gear"
          linkId="styles"
          onClick={() => handleBlockClick('styles')}
        />

        <PawnPainterBlocks
          title="Get Extension"
          description="Free on VS Code Marketplace"
          icon="extension"
          linkId="download"
          onClick={() => handleBlockClick('download')}
        />

        {/* Dynamic Content Section - only shown when activeSection is not null */}
        {activeSection && (
          <div className="painter-content-block" id="guide">
            <h2 className="content-title">
              {activeSection === 'hexColors' && 'Hex Colour Visualization'}
              {activeSection === 'gameText' && 'GameText Colour Preview'}
              {activeSection === 'inlineColors' && 'Inline Colour Format'}
              {activeSection === 'ignoreLines' && 'Selective Line Ignoring'}
              {activeSection === 'styles' && 'Customizable Highlighting Styles'}
              {activeSection === 'download' && 'Download and Installation'}
            </h2>
            {renderContent()}
          </div>
        )}

        {/* Standard Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default PawnPainter;