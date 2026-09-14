import { useLayoutEffect, useRef, useState } from 'react';
import {
  CARD_TEXT_MAX_LINES,
  CARD_BODY_LINE_HEIGHT_PX,
} from '~/v4/social/features/content-widget/constants';

export function useMaxBodyLines(enabled: boolean, layout: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState(CARD_TEXT_MAX_LINES);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!enabled || !el) return;

    setLines(Math.max(1, Math.floor(el.clientHeight / CARD_BODY_LINE_HEIGHT_PX)));
  }, [enabled, layout]);

  return { containerRef, lines };
}
