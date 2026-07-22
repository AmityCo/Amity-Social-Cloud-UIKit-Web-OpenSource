import { useEffect, useState } from 'react';

export type VisualViewportMetrics = {
  /** Current visible viewport height in CSS pixels. */
  height: number;
  /** How far the visible viewport has been offset from the top of the
   * layout viewport (positive when the document has scrolled up because
   * the browser is bringing a focused input into view). */
  offsetTop: number;
};

export function useVisualViewportHeight(): VisualViewportMetrics | null {
  const [metrics, setMetrics] = useState<VisualViewportMetrics | null>(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return null;
    return {
      height: window.visualViewport.height,
      offsetTop: window.visualViewport.offsetTop,
    };
  });

  useEffect(() => {
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    if (!vv) return;

    const update = () => setMetrics({ height: vv.height, offsetTop: vv.offsetTop });
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);

  return metrics;
}
