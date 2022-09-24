import React, { PropsWithChildren, useRef, useEffect } from 'react';
import { useInView, InViewProps } from '@noom/wax-component-library';

import { useActionEvents } from '~/core/providers/ActionProvider';

export type ImpressionTrackerProps = PropsWithChildren<Omit<InViewProps, 'onChange'>> & {
  postId: string;
  timeInSeconds?: number;
  className?: string;
};

export function ImpressionTracker({
  children,
  timeInSeconds = 5,
  postId,
  className,
  ...options
}: ImpressionTrackerProps) {
  const actionEvents = useActionEvents();
  const timeoutRef = useRef<NodeJS.Timeout>();

  function handleVisible(isVisible: boolean) {
    if (!timeoutRef.current && isVisible) {
      timeoutRef.current = setTimeout(() => {
        actionEvents.onPostImpression?.({ postId });
      }, timeInSeconds * 1000);
    } else if (timeoutRef.current && !isVisible) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const { ref } = useInView<HTMLDivElement>({
    onChange: handleVisible,
    visibleThreshold: 1,
    ...options,
  });

  return (
    <div ref={ref} data-type="impression-tracker" className={className}>
      {children}
    </div>
  );
}
