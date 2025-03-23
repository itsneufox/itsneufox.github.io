import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Block from './components/Block';
import LogoBlock from './components/LogoBlock';
import Footer from './components/Footer';
import PawnPainter from './components/PawnPainter';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={
            <div className="app">
              <div className="blocks-container">
                <LogoBlock />
                <Block 
                  title="About" 
                  description="Learn about my profile and work"
                  icon="user"
                  link="https://github.com/itsneufox"
                />
                <Block 
                  title="Work" 
                  description="Browse my projects and code"
                  icon="briefcase"
                  link="https://github.com/itsneufox?tab=repositories"
                />
                <Block 
                  title="LongWayDrivers" 
                  description="Trucking server for open.mp"
                  icon="truck"
                  link="https://github.com/longwaydrivers"
                />
                <Block 
                  title="PAWN Painter" 
                  description="Color picker tool for PAWN in VS Code"
                  icon="palette"
                  link="/pawnpainter"
                />
                <Block 
                  title="GameText Plus" 
                  description="Improved GameText system for open.mp"
                  icon="text"
                  link="https://github.com/itsneufox/GameText-Plus"
                />
                <Block 
                  title="CamEditor" 
                  description="Create smooth camera movements in-game"
                  icon="camera"
                  link="https://github.com/itsneufox/CamEditor-open.mp"
                />
                <Footer />
              </div>
            </div>
          } />
          <Route path="/pawnpainter" element={<PawnPainter />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;