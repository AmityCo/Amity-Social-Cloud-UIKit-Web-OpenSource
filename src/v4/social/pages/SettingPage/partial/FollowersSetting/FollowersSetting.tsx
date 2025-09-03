import React from 'react';
import styles from './FollowersSetting.module.css';
import { Typography } from '~/v4/core/components';
import { RadioGroup } from '~/v4/core/components/AriaRadioGroup';

const radioOptions = [
  {
    value: 'everyone',
    label: 'Tutti possono seguirmi',
  },
  {
    value: 'request',
    label: 'Voglio ricevere la richiesta per essere seguito',
  },
];

const FollowersSetting: React.FC = () => {
  return (
    <div className={styles.container}>
      <Typography.BodyBold className={styles.sectionHeading}>
        Come vuoi essere seguito
      </Typography.BodyBold>
      <div className={styles.optionWrapper}>
        <RadioGroup name="followers-setting" radios={radioOptions} />
      </div>
    </div>
  );
};

export default FollowersSetting;
