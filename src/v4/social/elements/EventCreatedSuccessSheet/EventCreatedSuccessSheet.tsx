import React from 'react';
import { Typography } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';
import { useAmityElement } from '~/v4/core/hooks/uikit';
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

  // Everything below the title is the post-to-feed prompt: the body reads
  // "Post it to a feed so more people can find and join.", and both buttons
  // answer it. With Post off the sheet keeps the confirmation and drops the
  // offer, rather than leaving that line over a button that opens a composer
  // nobody can reach. Asked on the same id as the `…` menu item, which is the
  // other door onto the same page — the two move together.
  const { isExcluded: isPostToFeedExcluded } = useAmityElement({
    pageId: 'event_detail_page',
    componentId: '*',
    elementId: 'create_event_post_button',
  });

  return (
    <div className={styles.eventCreatedSuccessSheet} data-title-only={isPostToFeedExcluded}>
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
        {!isPostToFeedExcluded && (
          <Typography.Body className={styles.eventCreatedSuccessSheet__description}>
            {description}
          </Typography.Body>
        )}
      </div>
      {!isPostToFeedExcluded && (
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
      )}
    </div>
  );
}
