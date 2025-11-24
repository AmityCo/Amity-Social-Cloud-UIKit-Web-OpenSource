import { useRef } from 'react';
import { ChevronDown } from '~/icons';
import { getTimeZones } from '@vvo/tzdb';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import { Popover } from '~/v4/core/components/AriaPopover';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { getFormattedTimeZone } from '~/v4/social/utils/timezone';
import styles from './TimeZone.module.css';
import TruncateMarkup from 'react-truncate-markup';

type TimeZoneProps = {
  value: { id: string; name: string };
  onChange: (value: { id: string; name: string }) => void;
};

export function TimeZone({ value, onChange }: TimeZoneProps) {
  const { setDrawerData, removeDrawerData } = useDrawer();
  const timeZoneListRef = useRef<HTMLUListElement>(null);

  const scrollToTimeZone = (id: string) => {
    const targetElement = timeZoneListRef.current?.children.namedItem(id);
    if (targetElement) {
      requestAnimationFrame(() =>
        targetElement.scrollIntoView({ behavior: 'auto', block: 'center' }),
      );
    }
  };

  const renderTimeZones = (close: () => void) => (
    <ul
      role="radiogroup"
      ref={timeZoneListRef}
      aria-label="Timezone selection"
      className={styles.timeZone__popoverContent}
    >
      {getTimeZones().map((timeZone) => (
        <li
          role="radio"
          id={timeZone.name}
          key={timeZone.name}
          aria-checked={value.id === timeZone.name}
          aria-selected={value.id === timeZone.name}
        >
          <Button
            type="button"
            variant="default"
            data-selected={value.id === timeZone.name}
            className={styles.timeZone__popoverItem}
            onPress={() => {
              close();
              onChange({
                id: timeZone.name,
                name: getFormattedTimeZone(timeZone),
              });
            }}
          >
            <Typography.BodyBold className={styles.timeZone__label}>
              {getFormattedTimeZone(timeZone)}
            </Typography.BodyBold>
          </Button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.timeZone}>
      <Typography.Body className={styles.timeZone__label}>Timezone</Typography.Body>
      <Popover
        className={styles.timeZone__popoverContent}
        trigger={({ openPopover, isDesktop }) => {
          return (
            <Button
              type="button"
              variant="default"
              className={styles.timeZone__button}
              aria-label="Click to open timezone selection"
              onPress={() => {
                isDesktop
                  ? openPopover()
                  : setDrawerData({ content: renderTimeZones(removeDrawerData) });
                requestAnimationFrame(() => scrollToTimeZone(value.id));
              }}
            >
              <Typography.Body className={styles.timeZone__label}>
                <TruncateMarkup>
                  <div>{value?.name}</div>
                </TruncateMarkup>
              </Typography.Body>
              <ChevronDown className={styles.timeZone__icon} />
            </Button>
          );
        }}
      >
        {({ closePopover }) => renderTimeZones(closePopover)}
      </Popover>
    </div>
  );
}
