import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseCountdownTimerProps {
  countdownFrom: number;
  totalDurationSeconds: number;
  isActive: boolean;
  onComplete?: () => void;
  onCountdownComplete?: () => void;
}

export interface UseCountdownTimerReturn {
  remainingSeconds: number;
  countdownSeconds: number;
  isCountingDown: boolean;
  isCompleted: boolean;
}

export const useCountdownTimer = ({
  countdownFrom,
  totalDurationSeconds,
  isActive,
  onComplete,
  onCountdownComplete,
}: UseCountdownTimerProps): UseCountdownTimerReturn => {
  const [remainingSeconds, setRemainingSeconds] = useState(totalDurationSeconds);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  const onCountdownCompleteRef = useRef(onCountdownComplete);

  // Update refs when callbacks change
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onCountdownCompleteRef.current = onCountdownComplete;
  }, [onComplete, onCountdownComplete]);

  const reset = useCallback(() => {
    setRemainingSeconds(totalDurationSeconds);
    setIsCompleted(false);
    startTimeRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [totalDurationSeconds]);

  useEffect(() => {
    if (isActive && !isCompleted) {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }

      intervalRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const remaining = Math.max(0, totalDurationSeconds - elapsed);

          setRemainingSeconds(remaining);

          if (remaining === 0) {
            setIsCompleted(true);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            onCompleteRef.current?.();
          }
        }
      }, 1000);
    } else if (!isActive) {
      reset();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, isCompleted, totalDurationSeconds, reset]);

  // Calculate countdown seconds (only show countdown during the last countdownFrom seconds)
  const countdownSeconds = remainingSeconds <= countdownFrom ? remainingSeconds : 0;
  const isCountingDown = remainingSeconds <= countdownFrom && remainingSeconds > 0;

  // Trigger countdown complete callback
  useEffect(() => {
    if (remainingSeconds === countdownFrom && isActive) {
      onCountdownCompleteRef.current?.();
    }
  }, [remainingSeconds, countdownFrom, isActive]);

  return {
    remainingSeconds,
    countdownSeconds,
    isCountingDown,
    isCompleted,
  };
};
