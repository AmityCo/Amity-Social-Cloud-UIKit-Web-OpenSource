import React from 'react';
import { useString, resolveString } from '~/v4/core/localization';
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
    <Drawer.Root
      open={isOpen}
      onOpenChange={onOpenChange}
      repositionInputs={false}
      onDrag={(event) => event.stopPropagation()}
    >
      <Drawer.Portal>
        <Drawer.Overlay className={styles.drawer__overlay} />
        <Drawer.Content
          className={styles.drawer__content}
          onTouchStart={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
          onTouchEnd={(event) => event.stopPropagation()}
        >
          <div className={styles.drawer__innerContent}>
            <div className={styles.drawer__placeholder} />
            <Drawer.Title className={styles.drawer__title}>
              <Typography.TitleBold>
                {useString('amity_common_ad_ad_about_title')}
              </Typography.TitleBold>
            </Drawer.Title>
            <div className={styles.drawer__content__data}>
              <Typography.BodyBold className={styles.drawer__content__data__title}>
                {useString('amity_common_ad_ad_why_title')}
              </Typography.BodyBold>
              <div className={styles.drawer__content__data__text}>
                <InfoCircle className={styles.drawer__content__data__infoIcon} />
                <Typography.Caption className={styles.drawer__content__data__caption}>
                  {useString('amity_common_ad_ad_why_description')}
                </Typography.Caption>
              </div>
            </div>
            <div className={styles.drawer__content__data}>
              <Typography.BodyBold className={styles.drawer__content__data__title}>
                {useString('amity_common_ad_ad_about_advertiser')}
              </Typography.BodyBold>
              <div className={styles.drawer__content__data__text}>
                <InfoCircle className={styles.drawer__content__data__infoIcon} />
                <Typography.Caption className={styles.drawer__content__data__caption}>
                  {resolveString(
                    'amity_common_ad_advertiser_name',
                    ad.advertiser?.companyName ?? '',
                  )}
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
