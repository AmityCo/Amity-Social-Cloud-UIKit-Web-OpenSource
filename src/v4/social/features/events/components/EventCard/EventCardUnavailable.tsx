import React from 'react';
import { Typography } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';
import { ImageSlash } from '~/v4/icons/ImageSlash';
import styles from './EventCard.module.css';

export type EventCardUnavailableProps = {
  size?: 'lg' | 'md';
  variant?: 'card' | 'list';
};

const stopBubble = (e: React.SyntheticEvent) => e.stopPropagation();

export function EventCardUnavailable({ size = 'lg', variant = 'card' }: EventCardUnavailableProps) {
  const deletedLabel = useString('amity_social_label_event_post_card_deleted');

  return (
    <div
      data-size={size}
      data-variant={variant}
      data-state="deleted"
      className={styles.eventCard}
      onClick={stopBubble}
      onPointerDown={stopBubble}
      onPointerUp={stopBubble}
      onMouseDown={stopBubble}
      onMouseUp={stopBubble}
    >
      <div className={styles.eventCard__deletedThumbnail} data-size={size} data-variant={variant}>
        <ImageSlash className={styles.eventCard__deletedIcon} />
      </div>
      <div className={styles.eventCard__deletedDetails}>
        <Typography.BodyBold className={styles.eventCard__deletedText}>
          {deletedLabel}
        </Typography.BodyBold>
      </div>
    </div>
  );
}
