import { useState, useEffect, useRef } from 'react';

export interface UseLivestreamTimerProps {
  isActive: boolean;
  mode?: 'countUp' | 'countDown';
  countdownFrom?: number; // seconds to count down from
  onComplete?: () => void;
}

export interface UseLivestreamTimerReturn {
  duration: string;
  elapsedSeconds: number;
  remainingSeconds: number;
  isCompleted: boolean;
}

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const useLivestreamTimer = ({
  isActive,
  mode = 'countUp',
  countdownFrom = 60,
  onComplete,
}: UseLivestreamTimerProps): UseLivestreamTimerReturn => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Update callback ref when it changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (isActive && !isCompleted) {
      // Start the timer
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
        setElapsedSeconds(0);
        setIsCompleted(false);
      }

      intervalRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setElapsedSeconds(elapsed);

          // Check if countdown is complete
          if (mode === 'countDown' && elapsed >= countdownFrom) {
            setIsCompleted(true);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            onCompleteRef.current?.();
          }
        }
      }, 1000);
    } else {
      // Stop the timer but keep the elapsed time
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, isCompleted, mode, countdownFrom]);

  // Reset timer when it becomes inactive
  useEffect(() => {
    if (!isActive) {
      startTimeRef.current = null;
      setElapsedSeconds(0);
      setIsCompleted(false);
    }
  }, [isActive]);

  // Calculate values based on mode
  const remainingSeconds = mode === 'countDown' ? Math.max(0, countdownFrom - elapsedSeconds) : 0;
  const displaySeconds = mode === 'countDown' ? remainingSeconds : elapsedSeconds;
  const duration = formatDuration(displaySeconds);

  return {
    duration,
    elapsedSeconds,
    remainingSeconds,
    isCompleted,
  };
};
