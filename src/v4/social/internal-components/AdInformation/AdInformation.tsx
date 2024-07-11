import React from 'react';
import { Typography } from '~/v4/core/components';
import InfoCircle from '~/v4/icons/InfoCircle';
import { Drawer } from 'vaul';

import styles from './AdInformation.module.css';

interface AdInformationProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ad: Amity.Ad;
}

export const AdInformation = ({ isOpen, onOpenChange, ad }: AdInformationProps) => {
  return (
    <Drawer.Root open={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className={styles.drawer__overlay} />
        <Drawer.Content className={styles.drawer__content}>
          <div className={styles.drawer__innerContent}>
            <div className={styles.drawer__placeholder} />
            <Drawer.Title className={styles.drawer__title}>
              <Typography.Title>About this advertisement</Typography.Title>
            </Drawer.Title>
            <div className={styles.drawer__content__data}>
              <Typography.BodyBold className={styles.drawer__content__data__title}>
                Why this advertisement?
              </Typography.BodyBold>
              <div className={styles.drawer__content__data__text}>
                <InfoCircle className={styles.drawer__content__data__infoIcon} />
                <Typography.Caption className={styles.drawer__content__data__caption}>
                  You're seeing this advertisement because it was displayed to all users in the
                  system.
                </Typography.Caption>
              </div>
            </div>
            <div className={styles.drawer__content__data}>
              <Typography.BodyBold className={styles.drawer__content__data__title}>
                About this advertiser
              </Typography.BodyBold>
              <div className={styles.drawer__content__data__text}>
                <InfoCircle className={styles.drawer__content__data__infoIcon} />
                <Typography.Caption className={styles.drawer__content__data__caption}>
                  Advertiser name: {ad.advertiser?.companyName}
                </Typography.Caption>
              </div>
            </div>
            <div className={styles.drawer__content__emptySpace}></div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
