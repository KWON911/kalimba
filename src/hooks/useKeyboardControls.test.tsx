import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useKeyboardControls } from './useKeyboardControls';

let root: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(async () => {
  if (root) await act(async () => root?.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
});

const renderKeyboardControls = async () => {
  const onPlay = vi.fn();
  const onActiveChange = vi.fn();
  const Harness = () => {
    useKeyboardControls({ onPlay, onActiveChange });
    return null;
  };
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => root?.render(<Harness />));
  return { onPlay, onActiveChange };
};

describe('useKeyboardControls', () => {
  it('uses KeyboardEvent.code for the requested physical keys and ignores retired keys', async () => {
    const { onPlay, onActiveChange } = await renderKeyboardControls();
    await act(async () => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyH' })));
    await act(async () => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyH' })));
    await act(async () => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyQ' })));
    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onPlay.mock.calls[0][0].note).toBe('C4');
    expect(onActiveChange.mock.calls).toEqual([['C4', true], ['C4', false]]);
  });

  it('keeps a C-major chord active for simultaneous physical keys', async () => {
    const { onPlay, onActiveChange } = await renderKeyboardControls();
    await act(async () => ['KeyH', 'KeyJ', 'KeyK'].forEach((code) => window.dispatchEvent(new KeyboardEvent('keydown', { code }))));
    expect(onPlay.mock.calls.map(([note]) => note.note)).toEqual(['C4', 'E4', 'G4']);
    expect(onActiveChange.mock.calls).toEqual([['C4', true], ['E4', true], ['G4', true]]);
  });
});
