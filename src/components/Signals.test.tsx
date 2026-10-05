import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import Signals from './Signals';
import { decode, records } from './SignalData';

const inputs = [[72, 68, 81, 87, 76, 93], [82, 68, 87, 85], [87, 68, 76, 75], [86, 75, 74, 82, 66, 73, 74, 71, 64], [72, 74, 74, 75, 82, 68, 73, 78], [71, 73, 80, 64, 85, 87, 76, 75, 81], [82, 76, 87, 64, 67, 87, 68, 72, 64], [70, 87, 81], [75, 74, 76, 87], [74, 80, 81, 87, 80, 75], [68, 81, 73, 68, 75, 81, 76, 86], [74, 87, 71, 76, 81], [70, 74, 67, 67, 64, 64], [85, 86, 85, 86, 85, 86], [70, 74, 75, 83, 74, 92], [86, 85, 73, 68, 81], [85, 76, 75, 66], [72, 68, 78, 64, 76, 81, 82, 74, 87, 78], [82, 77, 64, 87, 64, 68, 72, 76], [65, 83, 65], [85, 64, 82, 85, 64, 82], [85, 74, 87, 81, 68, 73], [68, 80, 87, 74, 87, 68], [70, 64, 73, 64, 71, 87, 68, 81, 64], [86, 81, 68, 87, 66, 68, 95, 64, 87], [74, 85, 64, 75, 5, 86, 64, 86, 68, 72, 64], [77, 64, 86, 74, 92, 68, 72], [71, 68, 66, 80, 83, 76, 93], [85, 73, 80, 66, 76, 75, 73, 76, 71, 87, 68, 87, 92, 64, 93, 81, 64, 75, 86, 76, 74, 75, 86, 64, 87, 83, 64, 87], [93, 74, 67, 80, 64, 75, 86, 81, 76], [73, 85, 66, 65, 64, 86, 87, 86]];
const type = (index: number, target: Element | Window = window) => {
  for (const key of decode(inputs[index])) fireEvent.keyDown(target, { key });
};
const advance = (ms: number) => act(() => { jest.advanceTimersByTime(ms); });
const dismiss = () => { fireEvent.keyDown(window, { key: 'Escape' }); advance(2000); };
const pointer = (type: string, x = 0, y = 0, target: Element | Window = window) => {
  const event = new MouseEvent(type, { bubbles: true, clientX: x, clientY: y });
  Object.defineProperty(event, 'pointerType', { value: 'mouse' });
  fireEvent(target, event);
};
const corners = () => [[1,1], [1023,1], [1023,767], [1,767]].forEach(([x,y]) => pointer('pointerdown', x, y));
const mark = (count: number) => { for (let i = 0; i < count; i++) fireEvent(window, new Event('site:mark')); };
const solve = () => {
  mark(9);
  for (const index of [28,29,30]) {
    fireEvent.change(screen.getByLabelText('Response'), { target: { value: decode(inputs[index]) } });
    fireEvent.submit(screen.getByLabelText('Response').closest('form')!);
  }
};
beforeEach(() => {
  jest.useFakeTimers('modern');
  Object.defineProperty(window, 'matchMedia', { writable: true, value: jest.fn().mockImplementation(() => ({ matches: false })) });
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 768 });
});
afterEach(() => { cleanup(); jest.clearAllTimers(); jest.useRealTimers(); });

it.each(Array.from({length: 24}, (_, i) => i))('activates keyboard scene %i and cleans up', id => {
  render(<Signals />); type(id);
  expect(document.querySelector(`.sf-${id}`)).toBeInTheDocument();
  expect(screen.getByText(decode(records[id][2]))).toBeInTheDocument();
  expect(document.body.dataset.signal).toBe(String(id));
  expect(document.querySelector('.sf-scene')?.children.length || document.querySelectorAll('.sf-target').length).toBeGreaterThan(0);
  dismiss(); expect(document.querySelector('.sf')).not.toBeInTheDocument();
  expect(document.body.dataset.signal).toBeUndefined();
});
it('recognizes ordered corner taps and rejects incorrect order', () => {
  render(<Signals />); pointer('pointerdown', 1023, 1); pointer('pointerdown', 1, 767);
  expect(document.querySelector('.sf')).not.toBeInTheDocument();
  corners(); expect(document.querySelector('.sf-24')).toBeInTheDocument();
});
it('recognizes reverse project visits', () => {
  render(<><Signals />{[0,1,2,3].map(i => <a className="project-row" key={i} href="#">Row {i}</a>)}</>);
  [3,2,1,0].forEach(i => fireEvent.focusIn(screen.getByText(`Row ${i}`)));
  expect(document.querySelector('.sf-25')).toBeInTheDocument();
});
it('requires a held name and cancels a short press', () => {
  render(<><Signals /><span className="profile-name">Name</span></>);
  pointer('pointerdown', 200, 200, screen.getByText('Name')); advance(1000); pointer('pointerup'); advance(500);
  expect(document.querySelector('.sf')).not.toBeInTheDocument();
  pointer('pointerdown', 200, 200, screen.getByText('Name')); advance(1400);
  expect(document.querySelector('.sf-26')).toBeInTheDocument();
});
it('recognizes footer double click but leaves links alone', () => {
  render(<><Signals /><footer><span>Footer</span><a href="#">Link</a></footer></>);
  fireEvent.doubleClick(screen.getByText('Link')); expect(document.querySelector('.sf')).not.toBeInTheDocument();
  fireEvent.doubleClick(screen.getByText('Footer')); expect(document.querySelector('.sf-27')).toBeInTheDocument();
});
it('recognizes cursor zigzags', () => {
  render(<Signals />);
  for (let i = 0; i < 9; i++) { advance(40); pointer('pointermove', i % 2 ? 100 : 300, 200); }
  expect(document.querySelector('.sf-28')).toBeInTheDocument();
});
it('launches an idle scene once, only while visible', () => {
  render(<Signals />); advance(75000); expect(document.querySelector('.sf')).not.toBeInTheDocument();
  advance(5000); expect(document.querySelector('.sf-29')).toBeInTheDocument();
  dismiss(); advance(90000); expect(document.querySelector('.sf')).not.toBeInTheDocument();
});
it('requires both prerequisites for scene 30', () => {
  render(<Signals />); type(24); expect(document.querySelector('.sf')).not.toBeInTheDocument();
  corners(); dismiss(); type(24); expect(document.querySelector('.sf')).not.toBeInTheDocument();
  type(11); dismiss(); type(24); expect(document.querySelector('.sf-30')).toBeInTheDocument();
});
it('requires twelve distinct discoveries AND puzzle success for scene 31', () => {
  render(<Signals />); type(25); expect(document.querySelector('.sf')).not.toBeInTheDocument();
  for (let i = 0; i < 12; i++) { type(i); dismiss(); }
  type(25); expect(document.querySelector('.sf')).not.toBeInTheDocument();
  solve(); dismiss(); type(25); expect(document.querySelector('.sf-31')).toBeInTheDocument();
});
it('counts discoveries once and enforces cooldown', () => {
  render(<Signals />); type(0); fireEvent.keyDown(window, {key:'Escape'}); type(1);
  expect(document.querySelector('.sf')).not.toBeInTheDocument();
  advance(2000); type(0); expect(screen.getByText('01 / 32 discoveries')).toBeInTheDocument();
});
it('catches all five bugs and resets the game on replay', () => {
  render(<Signals />); type(20);
  for (let i = 1; i <= 5; i++) fireEvent.click(screen.getByRole('button', {name:`Catch bug ${i}`}));
  expect(screen.getByText('All bugs caught. Ship it.')).toBeInTheDocument();
  expect(document.querySelectorAll('.sf-target')).toHaveLength(0);
  dismiss(); type(20); expect(document.querySelectorAll('.sf-target')).toHaveLength(5);
});
it('expires normal scenes and the longer game', () => {
  render(<Signals />); type(0); advance(14000); expect(document.querySelector('.sf')).not.toBeInTheDocument();
  type(20); advance(14000); expect(document.querySelector('.sf-20')).toBeInTheDocument();
  advance(11000); expect(document.querySelector('.sf')).not.toBeInTheDocument();
});
it('ignores input, modifier and repeated keys', () => {
  render(<><Signals /><input aria-label="Test input" /></>);
  type(0, screen.getByLabelText('Test input'));
  for (const key of decode(inputs[0])) fireEvent.keyDown(window, {key, ctrlKey:true});
  for (const key of decode(inputs[0])) fireEvent.keyDown(window, {key, repeat:true});
  expect(document.querySelector('.sf')).not.toBeInTheDocument();
});
it('resets a slow keyboard sequence', () => {
  render(<Signals />);
  for (const key of decode(inputs[0])) { fireEvent.keyDown(window, {key}); advance(2600); }
  expect(document.querySelector('.sf')).not.toBeInTheDocument();
});
it('cleans up listeners, timers and body state on unmount', () => {
  const {unmount} = render(<Signals />); type(0); unmount();
  expect(document.body.dataset.signal).toBeUndefined(); expect(jest.getTimerCount()).toBe(0);
  type(1); expect(document.querySelector('.sf')).not.toBeInTheDocument();
});
it('dismisses on document hide and never launches idle in background', () => {
  render(<Signals />); type(0);
  Object.defineProperty(document, 'hidden', {configurable:true, value:true}); fireEvent(document, new Event('visibilitychange'));
  expect(document.querySelector('.sf')).not.toBeInTheDocument(); advance(100000);
  expect(document.querySelector('.sf')).not.toBeInTheDocument();
});
it('reveals the first hint and then the puzzle on mark taps', () => {
  render(<Signals />); mark(5); expect(document.querySelector('.signal-notice')).toBeInTheDocument();
  expect(document.querySelector('.signal-burst')).toBeInTheDocument(); mark(4);
  expect(screen.getByRole('dialog', {name:'Signal 1 / 3'})).toBeInTheDocument();
});
it('opens the puzzle with the controller sequence', () => {
  render(<Signals />);
  ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'].forEach(key => fireEvent.keyDown(window, {key}));
  expect(screen.getByRole('dialog', {name:'Signal 1 / 3'})).toBeInTheDocument();
});
it.each([26,27])('activates classic reaction %i', index => {
  render(<Signals />); type(index); expect(document.querySelector('.signal-notice')).toBeInTheDocument();
  expect(document.querySelector('.signal-burst')).toBeInTheDocument(); advance(6500);
  expect(document.querySelector('.signal-notice')).not.toBeInTheDocument();
});
it('rejects wrong answers and reveals video only after all three correct answers', () => {
  render(<Signals />); expect(document.querySelector('iframe')).not.toBeInTheDocument(); mark(9);
  fireEvent.change(screen.getByLabelText('Response'), {target:{value:'wrong'}});
  fireEvent.submit(screen.getByLabelText('Response').closest('form')!);
  expect(screen.getByLabelText('Response')).toHaveAttribute('aria-invalid','true');
  for (const index of [28,29,30]) {
    fireEvent.change(screen.getByLabelText('Response'), {target:{value:decode(inputs[index])}});
    fireEvent.submit(screen.getByLabelText('Response').closest('form')!);
  }
  expect(screen.getByRole('dialog',{name:'Puzzle reward'})).toBeInTheDocument();
  expect(document.querySelector('iframe')).toHaveAttribute('src', expect.stringContaining('youtube-nocookie.com/embed/'));
  expect(screen.getByRole('link', {name:/Open your reward/})).toHaveAttribute('target','_blank');
  dismiss(); expect(document.querySelector('iframe')).not.toBeInTheDocument();
});
it('flashes after six rapid theme toggles with cooldown', () => {
  render(<Signals />);
  const toggle = () => fireEvent(window, new Event('site:palette'));
  for (let i = 0; i < 5; i++) toggle(); expect(document.querySelector('.signal-exposure')).not.toBeInTheDocument();
  toggle(); expect(document.querySelector('.signal-exposure')).toBeInTheDocument(); advance(2400);
  for (let i = 0; i < 6; i++) toggle(); expect(document.querySelector('.signal-exposure')).not.toBeInTheDocument();
  advance(12600); for (let i = 0; i < 6; i++) toggle(); expect(document.querySelector('.signal-exposure')).toBeInTheDocument();
});
it('does not flash for slow toggles or reduced motion', () => {
  render(<Signals />);
  for (let i = 0; i < 6; i++) { fireEvent(window, new Event('site:palette')); advance(600); }
  expect(document.querySelector('.signal-exposure')).not.toBeInTheDocument();
  (window.matchMedia as jest.Mock).mockReturnValue({matches:true});
  for (let i = 0; i < 6; i++) fireEvent(window, new Event('site:palette'));
  expect(document.querySelector('.signal-exposure')).not.toBeInTheDocument();
});
