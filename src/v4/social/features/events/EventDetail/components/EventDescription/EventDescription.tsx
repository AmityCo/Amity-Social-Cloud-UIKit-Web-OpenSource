import dayjs from 'dayjs';
import { useString, resolveString } from '~/v4/core/localization';
import { Record } from '~/v4/icons/Record';
import useSDK from '~/v4/core/hooks/useSDK';
import { Location } from '~/v4/icons/Location';
import { BrandBadge, UserAvatar } from '~/v4/social/elements';
import { Typography } from '~/v4/core/components';
import TruncateMarkup from 'react-truncate-markup';
import { Button } from '~/v4/core/components/AriaButton';
import { AmityEventStatus, AmityEventType } from '@amityco/ts-sdk';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { EVENT_TYPE, STATUS_LABEL } from '~/v4/social/features/events/constants';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge';
import styles from './EventDescription.module.css';
import { Attendee } from '~/v4/icons/Attendee';
import { millify } from 'millify';
import { formatEventDuration, checkIsWithinMinutes } from '~/v4/social/utils/timezone';

type EventDescriptionProps = {
  event: Amity.Event;
};

export function EventDescription({ event }: EventDescriptionProps) {
  const { currentUserId, isVisitorOrBot } = useSDK();
  const { AmityEventDetailPageBehavior } = usePageBehavior();

  const statusLabel = useString(STATUS_LABEL[event.status]);
  const startsLabel = useString('amity_social_button_starts');
  const eventTypeLabel = useString('amity_social_button_event_type');
  const attendeesLabel = useString('amity_social_button_attendees');
  const hostedByLabel = useString('amity_social_button_hosted_by');

  return (
    <div className={styles.eventDescription}>
      <div className={styles.eventDescription__community}>
        <Typography.CaptionBold as="span" className={styles.eventDescription__status}>
          {statusLabel}
        </Typography.CaptionBold>
        <Typography.CaptionBold as="span" className={styles.eventDescription__status}>
          •
        </Typography.CaptionBold>
        {!event.targetCommunity?.isPublic && <CommunityPrivateBadge />}
        <Button
          variant="text"
          className={styles.eventDescription__communityButton}
          onPress={() =>
            AmityEventDetailPageBehavior?.goToCommunityProfilePage?.({
              communityId: event.originId,
            })
          }
        >
          <Typography.BodyBold as="span" className={styles.eventDescription__name}>
            <TruncateMarkup lines={1}>
              <span>{event.targetCommunity?.displayName}</span>
            </TruncateMarkup>
          </Typography.BodyBold>
        </Button>
        {event.targetCommunity?.isOfficial && <CommunityOfficialBadge />}
      </div>
      <Typography.Headline className={styles.eventDescription__title}>
        <TruncateMarkup lines={2}>
          <span>{event.title}</span>
        </TruncateMarkup>
      </Typography.Headline>
      <div className={styles.eventDescription__details}>
        <div className={styles.eventDescription__row}>
          <div className={styles.eventDescription__dateIconContainer}>
            <div className={styles.eventDescription__dateIconMonth}>
              {dayjs(event.startTime).format('MMM')}
            </div>
            <Typography.TitleBold className={styles.eventDescription__dateIconDay}>
              {dayjs(event.startTime).format('D')}
            </Typography.TitleBold>
          </div>
          <div>
            <Typography.Caption className={styles.eventDescription__subTitle}>
              {startsLabel}
            </Typography.Caption>
            <Typography.BodyBold className={styles.eventDescription__name}>
              {formatEventDuration(event.startTime, event.endTime)}
            </Typography.BodyBold>
          </div>
        </div>
        <div className={styles.eventDescription__row}>
          <div className={styles.eventDescription__iconContainer}>
            {event.type === AmityEventType.Virtual ? (
              <Record className={styles.eventDescription__icon} />
            ) : (
              <Location className={styles.eventDescription__icon} />
            )}
          </div>
          <div>
            <Typography.Caption className={styles.eventDescription__subTitle}>
              {eventTypeLabel}
            </Typography.Caption>
            <Typography.BodyBold className={styles.eventDescription__name}>
              {resolveString(EVENT_TYPE[event.type])}
            </Typography.BodyBold>
          </div>
        </div>

        {event.rsvpCount > 0 && !isVisitorOrBot && (
          <Button
            onPress={() =>
              AmityEventDetailPageBehavior?.goToEventAttendeesPage?.({
                event,
              })
            }
            variant="text"
            className={styles.eventDescription__attendeeButton}
          >
            <div className={styles.eventDescription__row}>
              <div className={styles.eventDescription__iconContainer}>
                <Attendee className={styles.eventDescription__icon} />
              </div>
              <div>
                <Typography.Caption className={styles.eventDescription__subTitle}>
                  {attendeesLabel}
                </Typography.Caption>
                <Typography.BodyBold className={styles.eventDescription__name}>
                  {millify(event.rsvpCount)}
                </Typography.BodyBold>
              </div>
            </div>
          </Button>
        )}

        <Button
          variant="default"
          aria-label="Click to go host profile"
          className={styles.eventDescription__row}
          onPress={() => {
            AmityEventDetailPageBehavior?.goToUserProfilePage?.({ userId: event.userId });
          }}
        >
          <div>
            <UserAvatar
              userId={event.userId}
              shouldRedirectToUserProfile
              className={styles.eventDescription__hostAvatar}
            />
          </div>
          <div className={styles.eventDescription__name}>
            <Typography.Caption className={styles.eventDescription__subTitle}>
              {hostedByLabel}
            </Typography.Caption>
            <div className={styles.eventDescription__hostInfo}>
              <Typography.BodyBold className={styles.eventDescription__name}>
                <TruncateMarkup lines={1}>
                  <span>{event?.creator?.displayName || event?.creator?.userPublicId}</span>
                </TruncateMarkup>
              </Typography.BodyBold>
              {event?.creator?.isBrand && (
                <BrandBadge className={styles.eventDescription__brandBadge} />
              )}
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
}
