import { useState } from 'react';
import { DateValue } from 'react-aria';
import { TrashIcon } from '~/v4/icons/Trash';
import { Time } from '@internationalized/date';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import { Popover } from '~/v4/core/components/AriaPopover';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { DateTimePicker } from '~/v4/core/components/DateTimePicker';
import styles from './EndTime.module.css';

type EndTimeProps = {
  minTime?: Time;
  value: Date | null;
  minDate?: DateValue;
  setDefaultEndOn: () => void;
  onChange: (value: Date | null) => void;
};

export function EndTime({ value, onChange, minDate, minTime, setDefaultEndOn }: EndTimeProps) {
  const { setDrawerData, removeDrawerData } = useDrawer();
  const [isEndDateIncluded, setIsEndDateIncluded] = useState(true);

  const renderEndTimePicker = (close: () => void) => (
    <div className={styles.endTime__dateTimePickerContainer}>
      <DateTimePicker
        value={value}
        label="Ends on"
        minDate={minDate}
        onClose={close}
        minTime={minTime}
        onChange={(value) => {
          close();
          onChange(value);
        }}
      />
    </div>
  );

  return isEndDateIncluded ? (
    <div className={styles.endTime}>
      <Typography.Body className={styles.endTime__label}>Ends on</Typography.Body>
      <Popover
        trigger={({ openPopover, isDesktop }) => {
          return (
            <div className={styles.endTime__buttonContainer}>
              <Button
                variant="default"
                className={styles.endTime__button}
                onPress={() =>
                  isDesktop
                    ? openPopover()
                    : setDrawerData({ content: renderEndTimePicker(removeDrawerData) })
                }
              >
                <Typography.Body className={styles.endTime__label}>
                  {value?.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                  {' at '}
                  {value?.toLocaleTimeString('en-GB', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </Typography.Body>
              </Button>
              <Button
                variant="text"
                aria-label="Remove end date"
                className={styles.endTime__deleteButton}
                onPress={() => {
                  setIsEndDateIncluded(false);
                  onChange(null);
                }}
              >
                <TrashIcon className={styles.endTime__deleteIcon} />
              </Button>
            </div>
          );
        }}
      >
        {({ closePopover }) => renderEndTimePicker(closePopover)}
      </Popover>
    </div>
  ) : (
    <div className={styles.endTime__noEndDate}>
      <Typography.Caption className={styles.endTime__noEndDateLabel}>
        Event without specified end time will end after 12 hours.
      </Typography.Caption>
      <Button
        variant="outlined"
        color="secondary"
        onPress={() => {
          setDefaultEndOn();
          setIsEndDateIncluded(true);
        }}
      >
        Add end date and time
      </Button>
    </div>
  );
}
