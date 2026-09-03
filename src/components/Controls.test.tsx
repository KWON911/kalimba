import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Controls } from './Controls';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(async () => {
  if (root) await act(async () => root?.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
  Object.defineProperty(navigator, 'vibrate', { configurable: true, value: undefined });
});

const renderControls = async () => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => root?.render(<Controls volume={80} haptics={false} loading={false} onVolumeChange={vi.fn()} onHapticsChange={vi.fn()} />));
  return container;
};

describe('Controls', () => {
  it('hides haptic controls when the Vibration API is unavailable and has no display-mode selector', async () => {
    Object.defineProperty(navigator, 'vibrate', { configurable: true, value: undefined });
    const view = await renderControls();
    expect(view.textContent).not.toContain('햅틱');
    expect(view.querySelector('select')).toBeNull();
  });

  it('shows haptic controls only when the Vibration API is supported', async () => {
    Object.defineProperty(navigator, 'vibrate', { configurable: true, value: vi.fn() });
    const view = await renderControls();
    expect(view.textContent).toContain('햅틱');
  });
});
