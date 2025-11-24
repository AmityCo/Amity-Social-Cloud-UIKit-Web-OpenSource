import { Button } from '~/v4/core/natives/Button';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Calendar, CalendarCell, CalendarGrid, Heading } from 'react-aria-components';
import styles from './Calendar.module.css';

import {
  CalendarDate,
  CalendarDateTime,
  getLocalTimeZone,
  today,
  ZonedDateTime,
} from '@internationalized/date';
import { DateValue } from 'react-aria';
import { ArrowLeft } from '~/v4/icons/ArrowLeft';

type CalendarComponentProps = {
  pageId?: string;
  componentId?: string;
  date: CalendarDate;
  setDate?: ((value: CalendarDate | CalendarDateTime | ZonedDateTime) => void) | undefined;
  defaultValue?: DateValue;
  minValue?: DateValue;
  maxValue?: DateValue;
  isDisabledDate?: boolean;
};

export const CalendarComponent = ({
  pageId = '*',
  componentId = '*',
  date,
  setDate,
  defaultValue,
  minValue,
  maxValue,
  isDisabledDate = false,
}: CalendarComponentProps) => {
  const currentDate = today(getLocalTimeZone());

  const elementId = 'calendar';

  const { accessibilityId } = useAmityElement({ pageId, componentId, elementId });

  return (
    <Calendar
      value={date}
      defaultValue={defaultValue ?? currentDate}
      defaultFocusedValue={defaultValue ?? currentDate}
      onChange={setDate}
      className={styles.calendar}
      aria-label="Select a date"
      minValue={minValue ?? undefined}
      maxValue={maxValue ?? undefined}
    >
      <div className={styles.calendarHeader}>
        <div className={styles.calendar__subHeader}>
          <Heading
            slot="title"
            aria-label="calendar-heading"
            className={styles.calendar__heading}
          />
          <div className={styles.calendar__buttonWrap}>
            <Button
              className={styles.calendar__navButton}
              slot="previous"
              aria-disabled={isDisabledDate}
            >
              <ArrowLeft className={styles.calendar__navLeft} />
            </Button>
            <Button
              className={styles.calendar__navButton}
              slot="next"
              aria-disabled={isDisabledDate}
            >
              <ArrowLeft className={styles.calendar__navRight} />
            </Button>
          </div>
        </div>
      </div>
      <CalendarGrid className={styles.calendar__grid} weekdayStyle="short">
        {(dateVal) => (
          <CalendarCell
            data-testid={accessibilityId}
            data-istoday={dateVal.toString() === currentDate.toString()}
            date={dateVal}
            className={styles.calendar__cell}
            aria-disabled={isDisabledDate}
            data-selected={dateVal.toString() === date.toString()}
          />
        )}
      </CalendarGrid>
    </Calendar>
  );
};
