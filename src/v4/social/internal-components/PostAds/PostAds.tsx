import React from 'react';
import styles from './PostAds.module.css';
import { Avatar, Button, Typography } from '~/v4/core/components';
import { AdsBadge } from '../AdsBadge/AdsBadge';
import Broadcast from '~/v4/icons/Broadcast';
import InfoCircle from '~/v4/icons/InfoCircle';
import { useAmityComponent } from '~/v4/core/hooks/uikit/index';

export const PostAds = ({ pageId = '*' }: { pageId?: string }) => {
  // TODO: add fetching the ads
  // const ads = useAds();
  // const avatarUrl = useFile(avatarFileId);
  const componentId = 'post_content';
  const { themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  return (
    // TODO: confirm the themeStyle is used from page level or component level
    <div className={styles.container} style={themeStyles}>
      <div className={styles.innerContainer}>
        <div className={styles.header}>
          <div className={styles.header__avatar}>
            <Avatar
              avatarUrl={
                'https://s3-alpha-sig.figma.com/img/eef3/8e4e/780e841c018e87aafef8a9b6b6652024?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kibPgi17krUs5Hm8fbQUs2K0BtGn6OYMm66m8eV70qjgUYZkY0I76K5KJqRA~gu-Zyi2Sex~KCizs5hQGBhBnb9ANNrUxfAKlXkS1taaZKt4fhxEgOWrHo8Hj6O7R5ZPuj7OOMHcd1fcE~1m9uLQrQGXsq-s8fwdCzLPTHBt~rNKq2sW4M4RoAiljCQNS5sITEe~e9Mu88PFj-9ygzlS4xR1KjNcSbki0tSEhMvY5Ma5R9si6DsOEFZv3s-X1YK-tsszAhe1elNSht7PxjfoygnC3Mtqye~S72Rj~tQbGGaNZwLqYgQwWr1EnJIk7v0JZctTZoVHtkOSAA4kZ5ASfg__'
              }
              defaultImage={<Broadcast />}
            />
          </div>
          <div>
            <Typography.BodyBold className={styles.header__title}>{'Amity'}</Typography.BodyBold>
            <AdsBadge />
          </div>
        </div>
        <div>
          <Typography.Body className={styles.content__text}>
            {/* TODO: change to use ads content */}
            {
              'Social features are proven to drive engagement, boost retention, and increase revenue. Discover how you can grow your product with Amity Social Cloud, no matter which industry you’re in. 🥰 📱'
            }
          </Typography.Body>

          <img
            className={styles.content__image}
            // TODO: change to use ads content
            src={
              'https://s3-alpha-sig.figma.com/img/0074/9e2f/62f75af189ae259254a5a9c895b0a720?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=if15s1aRBec0sxOI1LWXKauQgN75CeJzfpalOXd-OxggaTyJHKmPJwFVldnz~RB~ICaboLN9xKtbrPnAZY~GodOnxyOGvmAHRbmtE39Cjw-QMUlPbZ-C1YB72fwA9eDvpDkI-1pbvPF2Vh~TPT8x7Li8MVk8ifeyAt1ddRbyY546wEQibRf9xK6ilpdK6UJWkOW~0Paj~8OwdGqRgm8suXDSpmmnDcbpTUE5ntQb4ibOLQq6Cw9R1fVitGaIrfyDaRjH7qD~GiOBBVfNqoAX4LdfuavKpyDJrWTKWTODzR20VlhbOjsHQxh7ZI4g92IkxvPs9pUQST-xzmrzZ8C5vA__'
            }
          />
        </div>
      </div>
      <InfoCircle className={styles.infoIcon} />

      <div className={styles.footer}>
        <div>
          {/* TODO: change to use ads content */}
          <Typography.Body className={styles.footer__content__title}>
            {'Social media'}
          </Typography.Body>
          <Typography.BodyBold className={styles.footer__content__description}>
            {'Powering the social networks of tomorrow!'}
          </Typography.BodyBold>
        </div>
        {/* TODO: change to use ads content */}
        <Button className={styles.footer__content__button} variant="primary">
          {'Talk to sales'}
        </Button>
      </div>
    </div>
  );
};
