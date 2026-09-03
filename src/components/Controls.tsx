import type { ChangeEvent } from 'react';
import type { LabelMode } from '../types/kalimba';

interface ControlsProps {
  volume: number;
  labelMode: LabelMode;
  haptics: boolean;
  loading: boolean;
  onVolumeChange: (value: number) => void;
  onLabelModeChange: (value: LabelMode) => void;
  onHapticsChange: (value: boolean) => void;
}

export function Controls(props: ControlsProps) {
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen?.();
      else await document.documentElement.requestFullscreen?.();
    } catch {
      // The instrument remains usable where fullscreen is denied or unavailable.
    }
  };
  return (
    <header className="controls">
      <div className="title"><span>17-KEY</span> KALIMBA</div>
      <label className="volume-control">🔊 <input aria-label="음량" type="range" min="0" max="100" value={props.volume} onChange={(event: ChangeEvent<HTMLInputElement>) => props.onVolumeChange(Number(event.target.value))} /> <output>{props.volume}%</output></label>
      <label className="select-control">표시 <select value={props.labelMode} onChange={(event) => props.onLabelModeChange(event.target.value as LabelMode)}><option value="both">숫자 + 음이름</option><option value="number">숫자</option><option value="note">음이름</option><option value="none">표시 안 함</option></select></label>
      <label className="haptics-control"><input type="checkbox" checked={props.haptics} onChange={(event) => props.onHapticsChange(event.target.checked)} /> 햅틱</label>
      <button className="fullscreen-button" type="button" onClick={() => void toggleFullscreen()}>⛶ 전체화면</button>
      {props.loading && <span className="loading-status">음원 준비 중…</span>}
    </header>
  );
}
