import { useState } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';
import { BrandBadge, EventHostBadge } from '~/v4/social/elements';
import { FileRepository } from '@amityco/ts-sdk';
import { Typography } from '~/v4/core/components';
import TruncateMarkup from 'react-truncate-markup';
import { formatEventDuration } from '~/v4/social/utils/timezone';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { EventTypeBadge } from '~/v4/social/features/events/EventHub/elements';
import eventThumbnail from '~/v4/social/assets/images/event-default-thumbnail.png';
import { useString } from '~/v4/core/localization';
import styles from './EventCard.module.css';

type EventCardProps = {
  event: Amity.Event;
  size?: 'lg' | 'md';
  variant?: 'card' | 'list';
};

export function EventCard({ event, variant = 'card', size = 'lg' }: EventCardProps) {
  const { currentUserId } = useSDK();
  const [errorImage, setErrorImage] = useState(false);
  const { goToEventDetailPage } = useNavigation();
  const byCreatorLabel = useString(
    'amity_social_button_by_creator',
    event.creator?.displayName ?? event.creator?.userPublicId ?? '',
  );

  return (
    <div
      tabIndex={0}
      role="button"
      data-size={size}
      key={event.eventId}
      data-variant={variant}
      className={styles.eventCard}
      aria-label={`click to go event ${event.title} details`}
      onClick={() => goToEventDetailPage({ eventId: event.eventId })}
      onKeyDown={() => goToEventDetailPage({ eventId: event.eventId })}
    >
      <div className={styles.eventCard__figure} data-size={size} data-variant={variant}>
        <img
          onError={() => setErrorImage(true)}
          data-size={size}
          data-variant={variant}
          className={styles.eventCard__image}
          src={
            errorImage
              ? eventThumbnail
              : event.coverImage
                ? FileRepository.fileUrlWithSize(event.coverImage?.fileUrl, 'medium')
                : eventThumbnail
          }
        />
        <span className={styles.eventCard__eventType}>
          <EventTypeBadge type={event.type} />
        </span>
        {event?.userId === currentUserId && (
          <span className={styles.eventCard__hostBadge}>
            <EventHostBadge />
          </span>
        )}
      </div>
      <div className={styles.eventCard__info} data-size={size} data-variant={variant}>
        <Typography.CaptionBold className={styles.eventCard__duration} as="p">
          {formatEventDuration(event.startTime, event.endTime)}
        </Typography.CaptionBold>
        {size === 'lg' ? (
          <Typography.BodyBold className={styles.eventCard__title} as="p">
            <TruncateMarkup lines={2}>
              <div>{event.title}</div>
            </TruncateMarkup>
          </Typography.BodyBold>
        ) : (
          <Typography.BodyBold className={styles.eventCard__title} as="p">
            <TruncateMarkup>
              <div>{event.title}</div>
            </TruncateMarkup>
          </Typography.BodyBold>
        )}
        <div className={styles.eventCard__creator}>
          <Typography.Body className={styles.eventCard__creatorName} as="p">
            <TruncateMarkup lines={1}>
              <div>{byCreatorLabel}</div>
            </TruncateMarkup>
          </Typography.Body>
          {event.creator?.isBrand && (
            <div className={styles.eventCard__creatorBadgeContainer}>
              <BrandBadge className={styles.eventCard__creatorBadge} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
