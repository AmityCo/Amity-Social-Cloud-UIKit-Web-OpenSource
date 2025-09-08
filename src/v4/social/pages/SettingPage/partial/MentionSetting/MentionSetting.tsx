import React from 'react';
import styles from './MentionSetting.module.css';
import { Typography } from '~/v4/core/components';
import { RadioGroup } from '~/v4/core/components/AriaRadioGroup';
const radioOptions = [
  {
    value: 'showFeedPost',
    label: 'Si, mostra i post nel mio feed',
  },
  {
    value: 'hideFeedPost',
    label: 'no, non mostrarli nel mio feed',
  },
];

const MentionSetting: React.FC = () => {
  return (
    <div className={styles.container}>
      <Typography.BodyBold className={styles.sectionHeading}>
        Vuoi mostrare nel tuo feed i post in cui sei menzionato
      </Typography.BodyBold>
      <div className={styles.optionWrapper}>
        <RadioGroup name="followers-setting" radios={radioOptions} />
      </div>
    </div>
  );
};

export default MentionSetting;
