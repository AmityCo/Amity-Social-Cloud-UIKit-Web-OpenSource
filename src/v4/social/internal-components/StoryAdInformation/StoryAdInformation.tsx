import React from 'react';
import { Typography } from '~/v4/core/components';
import InfoCircle from '~/v4/icons/InfoCircle';
import { Drawer } from 'vaul';

import styles from './StoryAdInformation.module.css';

interface StoryAdInformationProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ad: Amity.Ad;
  targetRef: React.RefObject<HTMLDivElement>;
}

export const StoryAdInformation = ({
  isOpen,
  onOpenChange,
  ad,
  targetRef,
}: StoryAdInformationProps) => {
  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={onOpenChange}
      onDrag={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      }}
    >
      <Drawer.Portal container={targetRef?.current}>
        <div className={styles.drawer__container}>
          <div className={styles.drawer__innerContainer}>
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
              </div>
              <div className={styles.drawer__content__emptySpace}></div>
            </Drawer.Content>
          </div>
        </div>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
