import { ComponentProps, useState } from 'react';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import { PAGE_ID } from '~/v4/constants/customization';
import { Button } from '~/v4/core/components/AriaButton';
import { TimeField } from '~/v4/core/components/TimeField';
import { CalendarDate, Time } from '@internationalized/date';
import { Typography } from '~/v4/core/components/Typography';
import { CalendarComponent as Calendar } from '~/v4/core/components/Calendar';
import styles from './DateTimePicker.module.css';
import { useString } from '~/v4/core/localization';

type DateTimePickerProps = {
  label?: string;
  value?: Date | null;
  onClose?: () => void;
  onChange: (value: Date) => void;
  minDate?: ComponentProps<typeof Calendar>['minValue'];
  minTime?: ComponentProps<typeof TimeField>['minValue'];
};

export function DateTimePicker({
  label,
  value,
  minDate,
  minTime,
  onClose,
  onChange,
}: DateTimePickerProps) {
  const [date, setDate] = useState(
    () =>
      new CalendarDate(
        value ? value.getFullYear() : new Date().getFullYear(),
        value ? value.getMonth() + 1 : new Date().getMonth() + 1,
        value ? value.getDate() : new Date().getDate(),
      ),
  );
  const [time, setTime] = useState(
    () =>
      new Time(
        value ? value.getHours() : new Date().getHours(),
        value ? value.getMinutes() : new Date().getMinutes(),
      ),
  );

  const formattedDate = new Date(
    date?.year,
    date?.month - 1,
    date?.day,
    time?.hour,
    time?.minute,
    0,
    0,
  );

  const minDateTime = minDate
    ? new Date(
        minDate?.year,
        minDate?.month - 1,
        minDate?.day,
        minTime?.hour,
        minTime?.minute,
        0,
        0,
      )
    : new Date();

  return (
    <div className={styles.dateTimePicker}>
      <div className={styles.dateTimePicker__header}>
        <div className={styles.dateTimePicker__headerLeft}>
          <Button
            variant="default"
            onPress={() => onClose?.()}
            className={styles.dateTimePicker__headerLeftIcon}
            icon={<ChevronLeft className={styles.dateTimePicker__headerLeftIcon} />}
          />
        </div>
        <Typography.TitleBold className={styles.dateTimePicker__headerTitle}>
          {label}
        </Typography.TitleBold>
        <Button
          size="small"
          variant="text"
          onPress={() => onChange(formattedDate)}
          isDisabled={minDateTime.getTime() >= formattedDate.getTime()}
        >
          {useString('amity_social_button_done')}
        </Button>
      </div>
      <hr className={styles.dateTimePicker__divider} />
      <div className={styles.dateTimePicker__pickerContainer}>
        <TimeField value={time} onChange={setTime} pageId={PAGE_ID.EVENT_SETUP_PAGE} />
        <Calendar
          date={date}
          minValue={minDate}
          aria-label="Select a date"
          pageId={PAGE_ID.EVENT_SETUP_PAGE}
          setDate={(value) => setDate(value as typeof date)}
        />
      </div>
    </div>
  );
}
