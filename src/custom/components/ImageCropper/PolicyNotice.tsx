import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
// import { Checkbox } from '../ui/checkbox';
import styles from './ImageCropper.module.css';
import { Checkbox } from '~/v4/core/components/Checkbox';

const PolicyNotice = () => {
  const { t } = useTranslation('registration');
  return (
    <div className={styles.policyNotice}>
      <div className={styles.checkboxContainer}>
        <div>
          <Checkbox checked={true} onChange={() => false} />
        </div>
        <div className={styles.checkboxText}>
          <p>
            <Trans
              t={t}
              i18nKey="photo.note"
              components={{ bold: <span className={styles.bold} /> }}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolicyNotice;
