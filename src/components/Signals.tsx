import { CSSProperties, FormEvent, useEffect, useRef, useState } from 'react';
import './Signals.css';
import SignalField from './SignalField';

const copy: number[][] = [[109, 64, 68, 73, 81, 77, 5, 87, 64, 86, 81, 74, 87, 64, 65, 11, 5, 14, 1, 23, 16, 21, 9, 21, 21, 21, 11], [124, 74, 80, 5, 67, 74, 80, 75, 65, 5, 81, 77, 64, 5, 67, 76, 87, 86, 81, 5, 86, 76, 66, 75, 68, 73, 11, 5, 110, 64, 64, 85, 5, 81, 68, 85, 85, 76, 75, 66, 9, 5, 74, 87, 5, 81, 87, 92, 5, 68, 75, 5, 74, 73, 65, 5, 70, 74, 75, 81, 87, 74, 73, 73, 64, 87, 5, 81, 87, 76, 70, 78, 11], [119, 64, 68, 65, 5, 81, 77, 64, 5, 85, 87, 74, 79, 64, 70, 81, 5, 81, 92, 85, 64, 86, 5, 67, 87, 74, 72, 5, 81, 74, 85, 5, 81, 74, 5, 71, 74, 81, 81, 74, 72, 11, 5, 111, 74, 76, 75, 5, 81, 77, 64, 72, 5, 81, 74, 66, 64, 81, 77, 64, 87, 11], [113, 77, 64, 5, 75, 68, 72, 64, 5, 68, 81, 5, 81, 77, 64, 5, 81, 74, 85, 5, 74, 67, 5, 81, 77, 76, 86, 5, 85, 68, 66, 64, 11, 5, 103, 68, 70, 78, 82, 68, 87, 65, 86, 11, 5, 107, 74, 5, 85, 80, 75, 70, 81, 80, 68, 81, 76, 74, 75, 11], [99, 76, 87, 86, 81, 5, 70, 77, 68, 87, 68, 70, 81, 64, 87, 5, 74, 67, 5, 64, 68, 70, 77, 5, 85, 87, 74, 79, 64, 70, 81, 5, 81, 76, 81, 73, 64, 9, 5, 71, 74, 81, 81, 74, 72, 5, 81, 74, 5, 81, 74, 85, 11, 5, 113, 77, 64, 75, 5, 81, 77, 64, 5, 73, 68, 86, 81, 5, 70, 77, 68, 87, 68, 70, 81, 64, 87, 5, 74, 67, 5, 64, 68, 70, 77, 5, 81, 76, 81, 73, 64, 9, 5, 81, 74, 85, 5, 81, 74, 5, 71, 74, 81, 81, 74, 72, 11, 5, 111, 74, 76, 75, 5, 68, 73, 73, 5, 64, 76, 66, 77, 81, 11], [107, 74, 81, 5, 84, 80, 76, 81, 64, 11, 5, 105, 74, 74, 78, 5, 68, 81, 5, 81, 77, 64, 5, 85, 68, 66, 64, 5, 68, 66, 68, 76, 75, 11], [104, 108, 118, 118, 108, 106, 107, 5, 117, 100, 118, 118, 96, 97], [87, 64, 86, 85, 64, 70, 81, 5, 14], [108, 75, 83, 80, 73, 75, 64, 87, 68, 71, 76, 73, 76, 81, 92, 5, 64, 75, 68, 71, 73, 64, 65, 11, 5, 112, 75, 67, 74, 87, 81, 80, 75, 68, 81, 64, 73, 92, 9, 5, 102, 118, 118, 5, 70, 68, 75, 5, 86, 81, 76, 73, 73, 5, 77, 80, 87, 81, 5, 92, 74, 80, 11]];
const rewardSource = [77, 81, 81, 85, 86, 31, 10, 10, 82, 82, 82, 11, 92, 74, 80, 81, 80, 71, 64, 8, 75, 74, 70, 74, 74, 78, 76, 64, 11, 70, 74, 72, 10, 64, 72, 71, 64, 65, 10, 65, 116, 82, 17, 82, 28, 114, 66, 125, 70, 116, 26, 68, 80, 81, 74, 85, 73, 68, 92, 24, 20, 3, 87, 64, 73, 24, 21];
const rewardLink = [77, 81, 81, 85, 86, 31, 10, 10, 82, 82, 82, 11, 92, 74, 80, 81, 80, 71, 64, 11, 70, 74, 72, 10, 82, 68, 81, 70, 77, 26, 83, 24, 65, 116, 82, 17, 82, 28, 114, 66, 125, 70, 116];
const address = (values: number[]) => String.fromCharCode(...values.map(value => value ^ 37));
const read = (index: number) => copy[index].map(value => String.fromCharCode(value ^ 37)).join('');
const digest = (value: string) => {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) result = Math.imul(result ^ value.charCodeAt(index), 16777619);
  return result >>> 0;
};
const sequence = [821721083, 821721083, 2599823278, 2599823278, 3304671587, 2879007468, 3304671587, 2879007468, 3876335077, 3826002220];
const checks = [2658498373, 3049476004, 2641708633];

export default function Signals() {
  const [notice, setNotice] = useState('');
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState(0);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [burst, setBurst] = useState(0);
  const [exposure, setExposure] = useState(false);
  const [reward, setReward] = useState(false);
  const rewardClose = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const origin = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let position = 0;
    let buffer = '';
    let taps = 0;
    let lastTap = 0;
    let lastKey = 0;
    let changes: number[] = [];
    let readyAt = 0;
    const palette = () => {
      const now = performance.now();
      if (now < readyAt) return;
      changes = changes.filter(time => now - time < 2500);
      changes.push(now);
      if (changes.length < 6) return;
      changes = [];
      readyAt = now + 15000;
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setExposure(true);
    };
    const show = () => {
      origin.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setNotice('');
      setOpen(true);
      setError(false);
    };
    const mark = () => {
      const now = Date.now();
      taps = now - lastTap > 4000 ? 1 : taps + 1;
      lastTap = now;
      if (taps === 5) { setNotice(read(1)); setBurst(current => current + 1); }
      if (taps === 9) { taps = 0; show(); }
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (document.querySelector('.signal-reward')) origin.current?.focus();
        setReward(false);
      }
      if (event.defaultPrevented || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && (target.closest('input, textarea, select') || target.isContentEditable)) return;
      if (Date.now() - lastKey > 5000) { position = 0; buffer = ''; }
      lastKey = Date.now();
      const code = digest(event.key.toLowerCase());
      position = code === sequence[position] ? position + 1 : code === sequence[0] ? 1 : 0;
      if (position === sequence.length) { position = 0; show(); }
      if (event.key.length !== 1) return;
      buffer = (buffer + event.key.toLowerCase()).slice(-16);
      if (digest(buffer.slice(-7)) === 3260018505) { setNotice(read(0)); setBurst(current => current + 1); buffer = ''; }
      if (digest(buffer.slice(-7)) === 3578593383) { setNotice(read(8)); setBurst(current => current + 1); buffer = ''; }
    };
    window.addEventListener('site:mark', mark);
    window.addEventListener('site:palette', palette);
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('site:mark', mark); window.removeEventListener('site:palette', palette); window.removeEventListener('keydown', key); };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 6500);
    return () => window.clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    if (!burst) return;
    const timer = window.setTimeout(() => setBurst(0), 2400);
    return () => window.clearTimeout(timer);
  }, [burst]);
  useEffect(() => { if (open) input.current?.focus(); }, [open, stage]);
  useEffect(() => { if (reward) rewardClose.current?.focus(); }, [reward]);
  useEffect(() => {
    if (!exposure) return;
    const timer = window.setTimeout(() => setExposure(false), 2400);
    return () => window.clearTimeout(timer);
  }, [exposure]);

  const close = () => { setOpen(false); origin.current?.focus(); };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (digest(value.toLowerCase().replace(/[^a-z0-9]/g, '')) !== checks[stage]) { setError(true); return; }
    setError(false);
    setValue('');
    if (stage === checks.length - 1) {
      setNotice('');
      setReward(true);
      window.dispatchEvent(new Event('site:resolved'));
      setBurst(current => current + 1);
      setStage(0);
      close();
    } else setStage(current => current + 1);
  };

  return <>
    <SignalField />
    {reward && <section className="signal-reward" role="dialog" aria-label="Puzzle reward">
      <header><strong>Transmission unlocked</strong><button ref={rewardClose} type="button" aria-label="Close reward" onClick={() => { setReward(false); origin.current?.focus(); }}>×</button></header>
      <iframe src={address(rewardSource)} title="Puzzle reward video" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
      <a href={address(rewardLink)} target="_blank" rel="noopener noreferrer">Video not playing? Open your reward ↗</a>
    </section>}
    {exposure && <div className="signal-exposure" aria-hidden="true" />}
    {notice && <div className="signal-notice" role="status">{notice}</div>}
    {open && <aside className="signal-panel" role="dialog" aria-labelledby="signal-title" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); close(); } }}>
      <header><h2 id="signal-title">Signal {stage + 1} / {checks.length}</h2><button type="button" onClick={close} aria-label="Close signal">×</button></header>
      <p id="signal-prompt">{read(stage + 2)}</p>
      <form onSubmit={submit}>
        <label className="signal-label" htmlFor="signal-input">Response</label>
        <div className="signal-field"><input ref={input} id="signal-input" value={value} autoComplete="off" spellCheck={false} aria-describedby="signal-prompt" aria-invalid={error} onChange={event => { setValue(event.target.value); setError(false); }} /><button type="submit">Send →</button></div>
        {error && <p className="signal-error" role="status">{read(5)}</p>}
      </form>
    </aside>}
    {!!burst && <div className="signal-burst" aria-hidden="true" key={burst}>{Array.from({ length: 28 }, (_, index) => <i key={index} style={{ '--x': `${Math.cos(index * 2.4) * (110 + index * 5)}px`, '--y': `${Math.sin(index * 2.4) * (110 + index * 5)}px`, '--spin': `${index * 49}deg`, '--hue': `${index * 27}`, '--delay': `${index % 4 * 35}ms` } as CSSProperties} />)}</div>}
  </>;
}
