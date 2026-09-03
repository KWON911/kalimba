import { useEffect, useState, type ChangeEvent } from 'react';

interface ControlsProps {
  volume: number;
  haptics: boolean;
  fallbackFullscreen: boolean;
  loading: boolean;
  onVolumeChange: (value: number) => void;
  onHapticsChange: (value: boolean) => void;
  onFallbackFullscreenChange: (value: boolean) => void;
}

export function Controls(props: ControlsProps) {
  const supportsHaptics = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
  const supportsFullscreen = typeof document !== 'undefined' && typeof document.documentElement.requestFullscreen === 'function';
  const [isFullscreen, setIsFullscreen] = useState(() => Boolean(document.fullscreenElement));
  useEffect(() => {
    const updateFullscreenState = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', updateFullscreenState);
    return () => document.removeEventListener('fullscreenchange', updateFullscreenState);
  }, []);
  const toggleFullscreen = async () => {
    if (!supportsFullscreen) {
      props.onFallbackFullscreenChange(!props.fallbackFullscreen);
      return;
    }
    try {
      if (document.fullscreenElement) await document.exitFullscreen?.();
      else await document.documentElement.requestFullscreen?.();
    } catch {
      props.onFallbackFullscreenChange(true);
    }
  };
  return (
    <header className="controls">
      <div className="title"><span>17-KEY</span> KALIMBA</div>
      <label className="volume-control">🔊 <input aria-label="음량" type="range" min="0" max="100" value={props.volume} onChange={(event: ChangeEvent<HTMLInputElement>) => props.onVolumeChange(Number(event.target.value))} /> <output>{props.volume}%</output></label>
      {supportsHaptics && <label className="haptics-control"><input type="checkbox" checked={props.haptics} onChange={(event) => props.onHapticsChange(event.target.checked)} /> 햅틱</label>}
      <button className="fullscreen-button" type="button" onClick={() => void toggleFullscreen()}>{supportsFullscreen ? (isFullscreen ? '⛶ 전체화면 나가기' : '⛶ 전체화면') : (props.fallbackFullscreen ? '⛶ 기본 화면' : '⛶ 화면 확장')}</button>
      {props.loading && <span className="loading-status">음원 준비 중…</span>}
    </header>
  );
}
