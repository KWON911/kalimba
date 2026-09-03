export function PortraitNotice({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return <aside className="portrait-notice" role="status">가로 화면에서 연주하기 편합니다.<br />기기를 가로로 돌려주세요.</aside>;
}
