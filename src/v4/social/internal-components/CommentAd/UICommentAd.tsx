import React, { useState } from 'react';
import styles from './UICommentAd.module.css';
import { Avatar, Typography } from '~/v4/core/components';
import { AdsBadge } from '../AdsBadge/AdsBadge';
import Broadcast from '~/v4/icons/Broadcast';
import InfoCircle from '~/v4/icons/InfoCircle';
import { Button } from '~/v4/core/natives/Button';
import { AdInformation } from '../AdInformation/AdInformation';

interface UICommentAdProps {
  ad: Amity.Ad;
  avatarUrl?: string;
  adImageUrl?: string;
  themeStyles?: React.CSSProperties;
  onCallToActionClick?: (link: string) => void;
}

export const UICommentAd = ({
  ad,
  themeStyles,
  avatarUrl,
  adImageUrl,
  onCallToActionClick,
}: UICommentAdProps) => {
  const [isAdvertisementInfoOpen, setIsAdvertisementInfoOpen] = useState(false);

  const handleCallToActionClick = () => {
    onCallToActionClick?.(ad.callToActionUrl);
  };

  return (
    <div className={styles.commentAd} style={themeStyles}>
      <Button className={styles.infoIcon__button} onPress={() => setIsAdvertisementInfoOpen(true)}>
        <InfoCircle className={styles.infoIcon} />
      </Button>
      <div className={styles.commentAd__container}>
        <div className={styles.commentAd__avatar}>
          <Avatar avatarUrl={avatarUrl} defaultImage={<Broadcast />} />
        </div>
        <div className={styles.commentAd__details}>
          <div className={styles.commentAd__content}>
            <Typography.BodyBold className={styles.commentAd__content__advertiserName__container}>
              <div className={styles.commentAd__content__advertiserName}>{ad.advertiser?.name}</div>
            </Typography.BodyBold>

            <AdsBadge />

            <div>
              <Typography.Body className={styles.commentAd__content__text}>
                {ad.body}
              </Typography.Body>
            </div>

            <div className={styles.commentAd__adCard} onClick={handleCallToActionClick}>
              <div className={styles.commentAd__adCard__imageContainer}>
                <img className={styles.commentAd__adCard__image} src={adImageUrl} />
              </div>
              <div className={styles.commentAd__adCard__detail}>
                <div className={styles.commentAd__adCard__textContainer}>
                  <Typography.Caption className={styles.commentAd__adCard__description}>
                    {ad.description}
                  </Typography.Caption>
                  <Typography.BodyBold className={styles.commentAd__adCard__headline}>
                    {ad.headline}
                  </Typography.BodyBold>
                </div>
                {ad.callToActionUrl ? (
                  <Button
                    className={styles.commentAd__adCard__button}
                    onPress={handleCallToActionClick}
                  >
                    <Typography.CaptionBold className={styles.commentAd__adCard__button__text}>
                      {ad.callToAction}
                    </Typography.CaptionBold>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AdInformation
        ad={ad}
        isOpen={isAdvertisementInfoOpen}
        onOpenChange={(open) => setIsAdvertisementInfoOpen(open)}
      />
    </div>
  );
};
