import { MAX_INDICATOR_DOTS } from '~/v4/social/features/posts/constants';

export type IndicatorDotState = 'active' | 'inactive' | 'edge';

export type IndicatorDot = {
  key: string;
  state: IndicatorDotState;
  side?: 'left' | 'right';
};

export type IndicatorConfig = {
  dots: IndicatorDot[];
};

export function getIndicatorConfig(current: number, total: number): IndicatorConfig {
  if (total <= MAX_INDICATOR_DOTS) {
    const dots = Array.from({ length: total }, (_, page) => ({
      key: `page-${page}`,
      state: page === current ? ('active' as const) : ('inactive' as const),
    }));
    return { dots };
  }

  let windowStart: number;
  let windowEnd: number;

  if (current <= 1) {
    windowStart = 0;
    windowEnd = 4;
  } else if (current >= total - 3) {
    windowStart = total - 5;
    windowEnd = total - 1;
  } else {
    windowStart = current - 1;
    windowEnd = current + 2;
  }

  const showLeft = windowStart > 0;
  const showRight = windowEnd < total - 1;

  const dots: IndicatorDot[] = [];

  if (showLeft) {
    dots.push({ key: 'edge-left', state: 'edge', side: 'left' });
  }

  for (let page = windowStart; page <= windowEnd; page += 1) {
    dots.push({
      key: `page-${page}`,
      state: page === current ? 'active' : 'inactive',
    });
  }

  if (showRight) {
    dots.push({ key: 'edge-right', state: 'edge', side: 'right' });
  }

  return { dots };
}
