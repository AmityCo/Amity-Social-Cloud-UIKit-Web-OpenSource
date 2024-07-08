import React from 'react';
import styles from './CommentAd.module.css';
import { Avatar, Typography } from '~/v4/core/components';
import { AdsBadge } from '../AdsBadge/AdsBadge';
import Broadcast from '~/v4/icons/Broadcast';
import InfoCircle from '~/v4/icons/InfoCircle';
import { useAmityComponent } from '~/v4/core/hooks/uikit/index';
import { Button } from '~/v4/core/natives/Button';
import useImage from '~/v4/core/hooks/useImage';

interface CommentAdProps {
  pageId?: string;
  ad: Amity.Ad;
}

export const CommentAd = ({ pageId = '*', ad }: CommentAdProps) => {
  const componentId = 'comment_tray_component';
  const { themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const avatarFile = useImage({ fileId: ad.advertiser?.avatar?.fileId });
  const avatarUrl = avatarFile || ad.advertiser?.avatar?.fileUrl || '';

  const adImageFile = useImage({ fileId: ad.image1_1?.fileId });
  const adImageUrl = adImageFile || ad.image1_1?.fileUrl || '';

  const handleCallToActionClick = () => {
    window?.open(ad?.callToActionUrl, '_blank');
  };

  return (
    <div className={styles.commentAd} style={themeStyles}>
      <InfoCircle className={styles.infoIcon} />
      <div className={styles.commentAd__container}>
        <div className={styles.commentAd__avatar}>
          <Avatar avatarUrl={avatarUrl} defaultImage={<Broadcast />} />
        </div>
        <div className={styles.commentAd__details}>
          <div className={styles.commentAd__content}>
            <Typography.BodyBold className={styles.commentAd__content__username}>
              {ad.advertiser?.companyName}
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
                <div>
                  <Typography.Caption className={styles.commentAd__adCard__caption}>
                    {ad.headline}
                  </Typography.Caption>
                  <Typography.BodyBold className={styles.commentAd__adCard__description}>
                    {ad.description}
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
    </div>
  );
};
