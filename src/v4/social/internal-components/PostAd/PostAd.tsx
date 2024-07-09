import React, { useState } from 'react';
import styles from './PostAd.module.css';
import { Avatar, Typography } from '~/v4/core/components';
import { AdsBadge } from '../AdsBadge/AdsBadge';
import Broadcast from '~/v4/icons/Broadcast';
import InfoCircle from '~/v4/icons/InfoCircle';
import { useAmityComponent } from '~/v4/core/hooks/uikit/index';
import { Button } from '~/v4/core/natives/Button';
import useImage from '~/v4/core/hooks/useImage';
import { AdInformation } from '../AdInformation.tsx/AdInformation';

interface PostAdProps {
  pageId?: string;
  ad: Amity.Ad;
}

export const PostAd = ({ pageId = '*', ad }: PostAdProps) => {
  const componentId = 'post_content';
  const { themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const [isAdvertisementInfoOpen, setIsAdvertisementInfoOpen] = useState(false);

  const avatarFile = useImage({ fileId: ad.advertiser?.avatar?.fileId });
  const avatarUrl = avatarFile || ad.advertiser?.avatar?.fileUrl || '';

  const adImageFile = useImage({ fileId: ad.image1_1?.fileId });
  const adImageUrl = adImageFile || ad.image1_1?.fileUrl || '';
  return (
    <div className={styles.container} style={themeStyles}>
      <div className={styles.innerContainer}>
        <div className={styles.header}>
          <div className={styles.header__avatar}>
            <Avatar avatarUrl={avatarUrl} defaultImage={<Broadcast />} />
          </div>
          <div className={styles.header__detail}>
            <Typography.BodyBold className={styles.header__title}>
              {ad.advertiser?.companyName}
            </Typography.BodyBold>
            <AdsBadge />
          </div>
        </div>
        <div>
          <Typography.Body className={styles.content__text}>{ad.body}</Typography.Body>
          <div className={styles.content__imageContainer}>
            <img className={styles.content__image} src={adImageUrl} />
          </div>
        </div>
      </div>
      <Button className={styles.infoIcon__button} onPress={() => setIsAdvertisementInfoOpen(true)}>
        <InfoCircle className={styles.infoIcon} />
      </Button>

      <div
        className={styles.footer}
        data-has-url={!!ad.callToActionUrl}
        onClick={() => window?.open(ad?.callToActionUrl, '_blank')}
      >
        <div>
          <Typography.Body className={styles.footer__content__title}>{ad.headline}</Typography.Body>
          <Typography.BodyBold className={styles.footer__content__description}>
            {ad.description}
          </Typography.BodyBold>
        </div>
        {ad.callToActionUrl ? (
          <Button
            className={styles.footer__content__button}
            onPress={() => window?.open(ad?.callToActionUrl, '_blank')}
          >
            <Typography.CaptionBold>{ad.callToAction}</Typography.CaptionBold>
          </Button>
        ) : null}
      </div>
      <AdInformation
        ad={ad}
        isOpen={isAdvertisementInfoOpen}
        onOpenChange={(open) => setIsAdvertisementInfoOpen(open)}
      />
    </div>
  );
};
