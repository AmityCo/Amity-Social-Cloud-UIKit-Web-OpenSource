import React from 'react';
import { Typography } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';
import { CalendarStar } from '~/v4/icons/CalendarStar';
import { CloseButton } from '~/v4/social/elements/CloseButton/CloseButton';
import styles from './EventCreatedSuccessSheet.module.css';

export type EventCreatedSuccessSheetProps = {
  onPostToFeed: () => void;
  onDismiss: () => void;
};

export function EventCreatedSuccessSheet({
  onPostToFeed,
  onDismiss,
}: EventCreatedSuccessSheetProps) {
  const title = useString('amity_social_label_event_created_success_title');
  const description = useString('amity_social_label_event_created_success_description');
  const postToFeed = useString('amity_social_button_post_to_feed');
  const maybeLater = useString('amity_social_button_maybe_later');

  return (
    <div className={styles.eventCreatedSuccessSheet}>
      <div className={styles.eventCreatedSuccessSheet__header}>
        <CloseButton
          pageId="event_detail_page"
          onPress={onDismiss}
          defaultClassName={styles.eventCreatedSuccessSheet__closeButton}
        />
      </div>
      <div className={styles.eventCreatedSuccessSheet__iconWrap}>
        <CalendarStar className={styles.eventCreatedSuccessSheet__icon} />
      </div>
      <div className={styles.eventCreatedSuccessSheet__label}>
        <Typography.Headline className={styles.eventCreatedSuccessSheet__title}>
          {title}
        </Typography.Headline>
        <Typography.Body className={styles.eventCreatedSuccessSheet__description}>
          {description}
        </Typography.Body>
      </div>
      <div className={styles.eventCreatedSuccessSheet__buttonContainer}>
        <button
          type="button"
          className={styles.eventCreatedSuccessSheet__primary}
          onClick={onPostToFeed}
        >
          <Typography.BodyBold>{postToFeed}</Typography.BodyBold>
        </button>
        <button
          type="button"
          className={styles.eventCreatedSuccessSheet__secondary}
          onClick={onDismiss}
        >
          <Typography.BodyBold>{maybeLater}</Typography.BodyBold>
        </button>
      </div>
    </div>
  );
}
