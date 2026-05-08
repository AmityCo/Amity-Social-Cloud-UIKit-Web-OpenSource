import React, { useEffect, useState } from 'react';
import { useString } from '~/v4/core/localization';
import styles from './PollDurationOptions.module.css';
import { Input, Label } from 'react-aria-components';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { Button as AriaButton } from '~/v4/core/components/AriaButton';
import AngleRight from '~/v4/icons/AngleRight';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import {
  CalendarDate,
  getLocalTimeZone,
  today,
  now,
  Time,
  CalendarDateTime,
  ZonedDateTime,
} from '@internationalized/date';
import { BackButton } from '~/v4/social/elements';
import { CalendarComponent as Calendar } from '~/v4/core/components/Calendar';
import { TimeField } from '~/v4/core/components/TimeField';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

type PollDurationOptionsProps = {
  pageId?: string;
  timeDuration: { value: number; label: string }[];
  duration?: { value: number; label: string };
  selectedDate?: CalendarDate;
  selectedTime?: Time;
  minTime?: { hour: number; minute: number };
  onChange: (duration: { value: number; label: string } | undefined) => void;
  onClose?: () => void;
  onChangeDate?: (date: CalendarDate | undefined) => void;
  onChangeTime?: (time: Time | undefined) => void;
};

//TODO: Refactor Radio button to use RadioGroup component

export const PollDurationOptions = ({
  pageId = '*',
  timeDuration,
  duration,
  selectedDate,
  selectedTime,
  onChange,
  onClose,
  onChangeDate,
  onChangeTime,
}: PollDurationOptionsProps) => {
  const componentId = 'poll_duration_options';

  const { themeStyles, accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

  const { isDesktop } = useResponsive();
  const timeNow = now(getLocalTimeZone());

  const [tempDuration, setTempDuration] = useState(duration);
  const [isShowDateTimePicker, setIsShowDateTimePicker] = useState(false);

  //Local state to handle UI unsaved changes
  const [date, setDate] = useState(selectedDate ?? today(getLocalTimeZone()));
  const [time, setTime] = useState(selectedTime ?? new Time(timeNow.hour, timeNow.minute));
  const [minTime, setMinTime] = useState<Time | undefined>(undefined);

  const currentDate = today(getLocalTimeZone());
  const maxDate = currentDate.add({ days: 30 });
  const isDisabledDate = date < currentDate || date > maxDate;

  const handleOnChange = (time: { value: number; label: string }) => {
    onChange(time);
    setTempDuration(time);
    onChangeDate?.(undefined);
    onChangeTime?.(undefined);
  };

  const onTimeChange = (value: Time) => setTime(value);

  const onDateChange = (value: ZonedDateTime | CalendarDate | CalendarDateTime) =>
    setDate(value as CalendarDate);

  const onClickDone = () => {
    onChangeDate?.(date);
    onChangeTime?.(time);
    setTempDuration(undefined);
    onChange(undefined);
    onClose?.();
  };

  useEffect(() => {
    setMinTime(
      date?.toString() === today(getLocalTimeZone()).toString()
        ? new Time(timeNow.hour, timeNow.minute)
        : undefined,
    );
  }, [date]);

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.pollDurationOptions__container}
    >
      {isShowDateTimePicker ? (
        <>
          <div className={styles.pollDurationOptions__calendar}>
            <div className={styles.calendarNav}>
              <BackButton onPress={() => setIsShowDateTimePicker(false)} />
              <Typography.TitleBold>
                {useString('amity_social_button_ends_on')}
              </Typography.TitleBold>
              <AriaButton
                slot={null}
                variant="text"
                onPress={onClickDone}
                isDisabled={minTime && time < minTime}
              >
                {useString('amity_social_button_done')}
              </AriaButton>
            </div>
            <TimeField
              pageId={pageId}
              componentId={componentId}
              value={time}
              onChange={onTimeChange}
              defaultValue={new Time(timeNow.hour, timeNow.minute)}
              minValue={minTime}
            />

            <Calendar
              pageId={pageId}
              componentId={componentId}
              date={date}
              defaultValue={currentDate}
              setDate={onDateChange}
              aria-label="Select a date"
              minValue={currentDate}
              maxValue={maxDate}
              isDisabledDate={isDisabledDate}
            />
          </div>
        </>
      ) : (
        <>
          {timeDuration.map((time) => (
            <Label
              key={time.value}
              htmlFor={`duration-${time.value}`}
              className={styles.pollDurationOptions__optionsLabel}
            >
              <div>
                <Typography.Body>{time.label}</Typography.Body>
              </div>
              <Input
                aria-label="poll_duration_options_radio"
                data-testid={`${pageId}/${componentId}/poll_duration_options_radio`}
                type="radio"
                id={`duration-${time.value}`}
                value={time.value}
                onChange={() => {
                  handleOnChange(time);
                }}
                className={`${styles.pollDurationOptions__radio} ${styles.pollDurationOptions__hiddenRadio}`}
                checked={tempDuration !== undefined && tempDuration?.value === time.value}
              />
              <span className={styles.pollDurationOptions__customRadio} />
            </Label>
          ))}
          <Button
            onPress={() => setIsShowDateTimePicker(true)}
            className={styles.pollDurationOptions__pickDateTime}
          >
            <Typography.Body>{useString('amity_social_pick_date_and_time')}</Typography.Body>
            <AngleRight className={styles.pollDurationOptions__angleRightIcon} />
          </Button>
        </>
      )}
    </div>
  );
};
