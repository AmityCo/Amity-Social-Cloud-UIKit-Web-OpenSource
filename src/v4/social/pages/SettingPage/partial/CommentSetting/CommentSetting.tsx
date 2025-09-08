import React from 'react';
import styles from './CommentSetting.module.css';
import { Typography } from '~/v4/core/components';
import { RadioGroup } from '~/v4/core/components/AriaRadioGroup/RadioGroup';
const radioOptions = [
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
const CommentSetting: React.FC = () => {
  return (
    <div className={styles.container}>
      <Typography.BodyBold className={styles.sectionHeading}>
        Chi può commentare i tuoi post
      </Typography.BodyBold>
      <div className={styles.optionWrapper}>
        <RadioGroup name="followers-setting" radios={radioOptions} />
      </div>
    </div>
  );
};

export default CommentSetting;
