import React from 'react';
import styles from './ChatSetting.module.css';
import { Typography } from '~/v4/core/components';
import { RadioGroup } from '~/v4/core/components/AriaRadioGroup';

const desiredSenderOptions = [
  {
    value: 'everyone',
    label: 'Tutti',
  },
  {
    value: 'friendsOnly',
    label: 'Solo amici',
  },
  {
    value: 'none',
    label: 'Nessuno',
  },
];
const visibilityOptions = [
  {
    value: 'online',
    label: 'Online',
  },
  {
    value: 'offline',
    label: 'Offline',
  },
  {
    value: 'busy',
    label: 'Occupato',
  },
];

const ChatSetting: React.FC = () => {
  return (
    <div className={styles.container}>
      <Typography.BodyBold className={styles.sectionHeading}>
        Da chi vuoi ricevere messaggi nella chat di Community?
      </Typography.BodyBold>
      <div className={styles.optionWrapper}>
        <RadioGroup name="desired-sender" radios={desiredSenderOptions} />
      </div>
      <Typography.BodyBold className={styles.sectionHeading}>
        Imposta il tuo stato visibile in chat
      </Typography.BodyBold>
      <div className={styles.optionWrapper}>
        <RadioGroup name="visibility" radios={visibilityOptions} />
      </div>
    </div>
  );
};

export default ChatSetting;
