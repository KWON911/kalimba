import { useEffect, useState } from 'react';

export function useOrientation() {
  const query = '(orientation: portrait) and (max-width: 767px)';
  const [isNarrowPortrait, setIsNarrowPortrait] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setIsNarrowPortrait(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return isNarrowPortrait;
}
