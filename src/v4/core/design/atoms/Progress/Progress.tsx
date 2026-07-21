import clsx from 'clsx';
import { forwardRef } from 'react';
import {
  Slider as AriaSlider,
  SliderTrack as AriaSliderTrack,
  SliderThumb as AriaSliderThumb,
} from 'react-aria-components';
import { Loader } from '~/v4/core/design/atoms/Loader';
import styles from './Progress.module.css';

export type ProgressVariant = 'scrubber' | 'spinner';

export type ProgressProps = {
  variant?: ProgressVariant;
  value?: number;
  onSeek?: (value: number) => void;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
};

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { variant = 'scrubber', value = 0, onSeek, onChange, disabled = false, className, ...props },
  ref,
) {
  const label = props['aria-label'] ?? 'Progress';

  if (variant === 'spinner') {
    return <Loader.Spinner className={className} aria-label={label} />;
  }

  return (
    <AriaSlider
      ref={ref}
      className={clsx(styles.progress, className)}
      value={value}
      onChange={(next) => onSeek?.(next as number)}
      onChangeEnd={(next) => onChange?.(next as number)}
      minValue={0}
      maxValue={100}
      isDisabled={disabled}
      aria-label={label}
    >
      <AriaSliderTrack className={styles.progress__track}>
        {({ state }) => (
          <>
            <div
              className={styles.progress__fill}
              style={{ width: `${state.getThumbPercent(0) * 100}%` }}
            />
            <AriaSliderThumb className={styles.progress__knob} />
          </>
        )}
      </AriaSliderTrack>
    </AriaSlider>
  );
});
