import { CSSProperties, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { decode, records } from './SignalData';
import './SignalField.css';

const hash = (text: string) => {
  let value = 2166136261;
  for (const char of text) value = Math.imul(value ^ char.charCodeAt(0), 16777619);
  return value >>> 0;
};
const editable = (target: EventTarget | null) => target instanceof HTMLElement &&
  !!(target.closest('input, textarea, select, [role="dialog"]') || target.isContentEditable);
const tokens = Array.from({ length: 36 }, (_, index) => index);

export default function SignalField() {
  const [active, setActive] = useState<number | null>(null);
  const [found, setFound] = useState(0);
  const [hits, setHits] = useState<number[]>([]);
  const discoveries = useRef(new Set<number>());
  const current = useRef<number | null>(null);
  const field = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let buffer = '';
    let lastKey = 0;
    let lastActivity = performance.now();
    let lastLaunch = -10000;
    let corners: number[] = [];
    let lastCorner = 0;
    let held = 0;
    let anchorX = 0;
    let direction = 0;
    let turns = 0;
    let lastTurn = 0;
    let lastPointer = 0;
    let solved = false;
    const launch = (id: number) => {
      const now = performance.now();
      if (current.current !== null || now - lastLaunch < 1800 || document.querySelector('.signal-panel, .signal-reward')) return;
      if (id === 30 && !(discoveries.current.has(24) && discoveries.current.has(11))) return;
      if (id === 31 && !(solved && discoveries.current.size >= 12)) return;
      lastLaunch = now;
      discoveries.current.add(id);
      setFound(discoveries.current.size);
      setHits([]);
      current.current = id;
      setActive(id);
    };
    const dismiss = () => { current.current = null; setActive(null); };
    const activity = () => { lastActivity = performance.now(); };
    const key = (event: KeyboardEvent) => {
      activity();
      if (event.key === 'Escape') { dismiss(); buffer = ''; return; }
      if (event.defaultPrevented || event.repeat || event.metaKey || event.ctrlKey || event.altKey || editable(event.target)) return;
      const now = performance.now();
      if (now - lastKey > 2500) buffer = '';
      lastKey = now;
      if (event.key.length !== 1) return;
      buffer = (buffer + event.key.toLowerCase()).slice(-24);
      const index = records.findIndex(([length, signature]) => length > 0 && hash(buffer.slice(-length)) === signature);
      if (index >= 0) { launch(index); buffer = ''; }
    };
    const down = (event: PointerEvent) => {
      activity();
      if (editable(event.target) || current.current !== null) return;
      const x = event.clientX, y = event.clientY;
      const right = x > window.innerWidth - 64, bottom = y > window.innerHeight - 64;
      if ((x < 64 || right) && (y < 64 || bottom)) {
        const value = bottom ? (right ? 2 : 3) : (right ? 1 : 0);
        const now = performance.now();
        if (now - lastCorner > 6000) corners = [];
        lastCorner = now;
        corners = value === corners.length ? [...corners, value] : value === 0 ? [0] : [];
        if (corners.length === 4) { corners = []; launch(24); }
      }
      if (event.target instanceof Element && event.target.closest('.profile-name')) {
        window.clearTimeout(held);
        held = window.setTimeout(() => launch(26), 1400);
      }
    };
    const up = () => { window.clearTimeout(held); };
    const double = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('footer') && !event.target.closest('a, button')) launch(27);
    };
    const move = (event: PointerEvent) => {
      activity();
      const now = performance.now();
      if (now - lastPointer < 32) return;
      lastPointer = now;
      field.current?.style.setProperty('--cursor-x', `${event.clientX}px`);
      field.current?.style.setProperty('--cursor-y', `${event.clientY}px`);
      if (event.pointerType !== 'mouse' || editable(event.target)) return;
      const delta = event.clientX - anchorX;
      if (Math.abs(delta) < 65) return;
      const next = Math.sign(delta);
      if (now - lastTurn > 1800) turns = 0;
      if (next !== direction) { turns += 1; lastTurn = now; direction = next; }
      anchorX = event.clientX;
      if (turns >= 9) { turns = 0; launch(28); }
    };
    const solve = () => { solved = true; };
    const visibility = () => { up(); activity(); if (document.hidden) dismiss(); };
    const idle = window.setInterval(() => {
      if (!discoveries.current.has(29) && !document.hidden && performance.now() - lastActivity > 75000 && !editable(document.activeElement)) {
        activity(); launch(29);
      }
    }, 5000);
    window.addEventListener('keydown', key);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('dblclick', double);
    window.addEventListener('scroll', activity, { passive: true });
    window.addEventListener('site:resolved', solve);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.clearTimeout(held); window.clearInterval(idle);
      window.removeEventListener('keydown', key);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('dblclick', double);
      window.removeEventListener('scroll', activity);
      window.removeEventListener('site:resolved', solve);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  useEffect(() => {
    if (active === null) return;
    document.body.dataset.signal = String(active);
    const timer = window.setTimeout(() => { current.current = null; setActive(null); }, active === 20 ? 25000 : 14000);
    return () => { window.clearTimeout(timer); delete document.body.dataset.signal; };
  }, [active]);

  if (active === null) return null;
  const [, , title, caption, glyph] = records[active];
  const dismiss = () => { current.current = null; setActive(null); };
  const particleModes = [0, 1, 2, 3, 10, 15, 23, 28, 29];
  return createPortal(<div ref={field} className={`sf sf-${active}`}>
    <div className="sf-scene" aria-hidden="true">
      {particleModes.includes(active) && tokens.map(index => <i key={index} style={{ '--i': index, '--left': `${(index * 47 + 7) % 100}%`, '--top': `${(index * 31 + 11) % 100}%`, '--angle': `${index * 137.5}deg`, '--delay': `${-(index % 9) * .43}s`, '--hue': index * 37, '--size': `${12 + index % 5 * 6}px` } as CSSProperties}>{active === 0 ? (index % 2 ? '010110' : '101001') : decode(glyph)}</i>)}
      {[4, 5, 6, 7, 8].includes(active) && <div className="sf-stamp">{decode(glyph)}<small>{String(active + 1).padStart(3, '0')}</small></div>}
      {active === 9 && <><div className="sf-sun" /><div className="sf-grid" /></>}
      {active === 11 && <div className="sf-system"><b />{[0, 1, 2].map(i => <i key={i} style={{ '--i': i } as CSSProperties}><span /></i>)}</div>}
      {active === 12 && <div className="sf-cup"><span>≈ ≈ ≈</span><b>☕</b></div>}
      {active === 13 && <div className="sf-cat"><span>{decode(glyph)}</span><small>QA</small><b>🐾</b></div>}
      {active === 14 && <div className="sf-road"><div className="sf-truck"><span>LWD</span><b /><i /><i /></div></div>}
      {active === 16 && <div className="sf-chat"><p>● ● ●</p><p>ping?</p><p>pong.</p><p>connection established ✓</p></div>}
      {active === 17 && <div className="sf-terminal"><p>$ make universe</p><p>✓ locating semicolon</p><p>✓ negotiating with compiler</p><p>✓ pretending this was intentional</p><div /><p>BUILD SUCCESSFUL</p></div>}
      {active === 18 && <div className="sf-missing"><strong>4<span>0</span>4</strong><small>You are here → ?</small></div>}
      {active === 19 && <div className="sf-dvd-x"><b className="sf-dvd-y">DVD<small>VIDEO</small></b></div>}
      {active === 21 && <div className="sf-portal">{[0, 1, 2, 3, 4].map(i => <i key={i} style={{ '--i': i } as CSSProperties} />)}</div>}
      {active === 22 && <div className="sf-aurora"><i /><i /><i /></div>}
      {active === 24 && <div className="sf-map"><span>N</span><b>⌖</b><svg viewBox="0 0 240 180"><path d="M20 20H220V160H20Z M20 20L120 90L220 160 M220 20L120 90L20 160" /></svg><small>× marks absolutely nothing</small></div>}
      {active === 26 && <div className="sf-id"><span>PERSONNEL FILE</span><strong>itsneufox</strong><p>Species: developer<br />Fuel: curiosity<br />Status: still compiling</p><b>▥ ▥ ▥ ▥ ▥</b></div>}
      {active === 27 && <div className="sf-receipt"><b>INTERNET GIFT SHOP</b><hr /><p>1 visit <span>€0.00</span></p><p>4 projects <span>€0.00</span></p><p>1 hidden receipt <span>priceless</span></p><hr /><p>TOTAL <span>one smile</span></p><small>No cookies were harmed.</small></div>}
      {active === 30 && <svg className="sf-constellation" viewBox="0 0 400 300"><path d="M50 200L120 50L200 160L320 70L350 240L200 160L50 200" />{[[50, 200], [120, 50], [200, 160], [320, 70], [350, 240]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="5" />)}</svg>}
      {active === 31 && <div className="sf-room"><div /><b>✳</b><p>There is always another door.</p></div>}
    </div>
    {active === 20 && <div className="sf-targets" role="group" aria-label="Catch five bugs">{[0, 1, 2, 3, 4].filter(index => !hits.includes(index)).map(index => <button key={index} className="sf-target" style={{ '--i': index, left: `${12 + index * 17}%`, top: `${24 + (index % 3) * 16}%` } as CSSProperties} aria-label={`Catch bug ${index + 1}`} onClick={() => setHits(previous => [...previous, index])}>✳</button>)}</div>}
    <aside className="sf-caption">
      <div role="status"><small>{String(found).padStart(2, '0')} / {records.length - 1} discoveries</small><strong>{active === 20 && hits.length === 5 ? 'All bugs caught. Ship it.' : decode(title)}</strong><p>{active === 20 ? `${hits.length} / 5 caught · ${decode(caption)}` : decode(caption)}</p></div>
      <button type="button" onClick={dismiss} aria-label="Dismiss effect">×</button>
    </aside>
  </div>, document.body);
}
