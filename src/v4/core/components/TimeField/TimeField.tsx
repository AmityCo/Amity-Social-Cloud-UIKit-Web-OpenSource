import React from 'react';
import styles from './TimeField.module.css';
import { Time } from '@internationalized/date';
import {
  Label,
  TimeField as TimeInput,
  DateInput,
  DateSegment,
  FieldError,
} from 'react-aria-components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type TimeFieldProps = {
  pageId?: string;
  componentId?: string;
  defaultValue?: Time;
  value: Time;
  minValue?: Time;
  onChange: (value: Time) => void;
};

export const TimeField = ({
  pageId = '*',
  componentId = '*',
  defaultValue,
  value,
  minValue,
  onChange,
}: TimeFieldProps) => {
  const elementId = 'time_field';

  const { accessibilityId } = useAmityElement({ pageId, componentId, elementId });

  return (
    <TimeInput
      value={value}
      onChange={onChange}
      defaultValue={defaultValue}
      hourCycle={24}
      minValue={minValue || undefined}
      className={styles.timeField__container}
    >
      <div className={styles.timeField__wrap}>
        <Label className={styles.timeField__label}>Time</Label>
        <DateInput data-testid={accessibilityId} className={styles.timeField__dateInput}>
          {(segment) => <DateSegment segment={segment} className={styles.timeField__dateSegment} />}
        </DateInput>
      </div>
      <FieldError className={styles.timeField__validateText} />
    </TimeInput>
  );
};
