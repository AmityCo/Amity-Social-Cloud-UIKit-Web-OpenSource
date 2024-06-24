import React, { useEffect, useState } from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit/index';
import clsx from 'clsx';
import styles from './StoryProgressBar.module.css';

interface ProgressBarProps {
  duration: number;
  currentIndex: number;
  storiesCount: number;
  isPaused: boolean;
  onComplete: () => void;
  pageId?: string;
  componentId?: string;
}

export const StoryProgressBar: React.FC<ProgressBarProps> = React.memo(
  ({
    pageId = '*',
    componentId = '*',
    duration,
    currentIndex,
    storiesCount,
    isPaused,
    onComplete,
  }) => {
    const elementId = 'progress_bar';
    const { config, isExcluded } = useAmityElement({
      pageId,
      componentId,
      elementId,
    });
    const [segments, setSegments] = useState<number[]>(new Array(storiesCount).fill(0));
    const [lastIndex, setLastIndex] = useState(currentIndex);

    const backgroundColor = config?.backgroundColor;
    const progressColor = config?.progressColor;

    useEffect(() => {
      if (currentIndex < lastIndex) {
        setSegments((prevSegments) => {
          const newSegments = [...prevSegments];
          newSegments[currentIndex] = 0;
          return newSegments;
        });
      }
      setLastIndex(currentIndex);
    }, [currentIndex, lastIndex]);

    useEffect(() => {
      let interval: NodeJS.Timeout;

      if (!isPaused) {
        interval = setInterval(() => {
          setSegments((prevSegments) => {
            const newSegments = [...prevSegments];
            if (newSegments[currentIndex] < 100) {
              newSegments[currentIndex] += (100 / duration) * 100;
              if (newSegments[currentIndex] >= 100) {
                newSegments[currentIndex] = 100;
                onComplete();
              }
            }
            return newSegments;
          });
        }, 100);
      }

      return () => {
        if (interval) clearInterval(interval);
      };
    }, [duration, currentIndex, isPaused, onComplete]);

    if (isExcluded) return null;

    return (
      <div
        className={clsx(styles.progressBarContainer)}
        style={{ backgroundColor } as React.CSSProperties}
      >
        {segments.map((progress, index) => (
          <div
            key={index}
            className={clsx(styles.progressSegment)}
            style={{
              width: `calc(${100 / storiesCount}% - 4px)`,
            }}
          >
            <div
              className={clsx(styles.progressBar)}
              style={
                {
                  width: `${index < currentIndex ? 100 : index === currentIndex ? progress : 0}%`,
                  backgroundColor: progressColor,
                } as React.CSSProperties
              }
            />
          </div>
        ))}
      </div>
    );
  },
);
