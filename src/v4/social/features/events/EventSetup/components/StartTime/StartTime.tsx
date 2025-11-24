import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import { Popover } from '~/v4/core/components/AriaPopover';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { getLocalTimeZone, today } from '@internationalized/date';
import { DateTimePicker } from '~/v4/core/components/DateTimePicker';
import styles from './StartTime.module.css';

type StartTimeProps = {
  value: Date;
  onChange: (value: Date) => void;
};

export function StartTime({ value, onChange }: StartTimeProps) {
  const { setDrawerData, removeDrawerData } = useDrawer();

  const renderStartTimePicker = (close: () => void) => (
    <div className={styles.startTime__dateTimePickerContainer}>
      <DateTimePicker
        value={value}
        label="Starts on"
        minDate={today(getLocalTimeZone())}
        onClose={close}
        onChange={(value) => {
          close();
          onChange(value);
        }}
      />
    </div>
  );

  return (
    <div className={styles.startTime}>
      <Typography.Body className={styles.startTime__label}>Starts on</Typography.Body>
      <Popover
        trigger={({ openPopover, isDesktop }) => {
          return (
            <Button
              variant="default"
              className={styles.startTime__button}
              onPress={() => {
                isDesktop
                  ? openPopover()
                  : setDrawerData({ content: renderStartTimePicker(removeDrawerData) });
              }}
            >
              <Typography.Body className={styles.startTime__label}>
                {value.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
                {' at '}
                {value.toLocaleTimeString('en-GB', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: false,
                })}
              </Typography.Body>
            </Button>
          );
        }}
      >
        {({ closePopover }) => renderStartTimePicker(closePopover)}
      </Popover>
    </div>
  );
}
