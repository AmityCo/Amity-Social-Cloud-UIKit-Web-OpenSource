import { AmityEventType } from '@amityco/ts-sdk';
import { Typography } from '~/v4/core/components';
import ChevronRight from '~/v4/icons/ChevronRight';
import { Button } from '~/v4/core/components/AriaButton';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { LocationForm } from '~/v4/social/features/events/EventSetup/components/LocationForm';
import { EventSetupValues } from '~/v4/social/features/events/EventSetup/hooks/useEventSetup';
import styles from './Location.module.css';

type LocationProps = {
  value: Pick<EventSetupValues, 'type' | 'platform' | 'externalUrl' | 'location'>;
  onChange: (
    value: Pick<EventSetupValues, 'type' | 'platform' | 'externalUrl' | 'location'>,
  ) => void;
};

export function Location({ value, onChange }: LocationProps) {
  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();
  const { setDrawerData, removeDrawerData } = useDrawer();

  const label =
    value.type === AmityEventType.Virtual
      ? value.platform === ''
        ? 'Select where this event will be happening'
        : value.platform === 'livestream'
          ? 'Live stream'
          : value.externalUrl
      : value.location;

  return (
    <Button
      type="button"
      variant="default"
      className={styles.location}
      aria-label="Click to open location dialog"
      onPress={() => {
        isDesktop
          ? openPopup({
              header: <Typography.Headline>Location</Typography.Headline>,
              children: ({ close }) => (
                <LocationForm value={value} onChange={onChange} onCancel={close} />
              ),
            })
          : setDrawerData({
              content: (
                <LocationForm value={value} onChange={onChange} onCancel={removeDrawerData} />
              ),
            });
      }}
    >
      {label === 'Select where this event will be happening' ? (
        <Typography.Body className={styles.location__label}>{label}</Typography.Body>
      ) : (
        <Typography.Body className={styles.location__value}>{label}</Typography.Body>
      )}
      <ChevronRight className={styles.location__icon} />
    </Button>
  );
}
