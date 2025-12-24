import { Typography } from '~/v4/core/components';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { COMPONENT_ID } from '~/v4/constants/customization';
import { AmityEventStatus, AmityEventType } from '@amityco/ts-sdk';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { CopyButton } from '~/v4/social/features/events/EventDetail/elements';
import { LiveStreamContent } from '~/v4/social/components/PostContent/LiveStreamContent';
import { TextWithMention } from '~/v4/social/internal-components/TextWithMention/TextWithMention';
import styles from './EventInfo.module.css';

type EventInfoProps = {
  pageId: string;
  event: Amity.Event;
};

export function EventInfo({ pageId, event }: EventInfoProps) {
  const componentId = COMPONENT_ID.EVENT_INFO;

  const { accessibilityId, isExcluded, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { AmityEventDetailPageBehavior } = usePageBehavior();

  if (isExcluded) return null;

  return (
    <section
      style={themeStyles}
      id={accessibilityId}
      className={styles.eventInfo}
      data-testid={accessibilityId}
    >
      <div className={styles.eventInfo__container}>
        <Typography.TitleBold className={styles.eventInfo__text}>
          About the event
        </Typography.TitleBold>
        <TextWithMention
          maxLines={10}
          mentionees={[]}
          textClassName={styles.eventInfo__text}
          data={{ text: event.description || '' }}
        />
      </div>

      {event.type === AmityEventType.Virtual ? (
        event.externalUrl ? (
          <div className={styles.eventInfo__container}>
            <Typography.TitleBold className={styles.eventInfo__text}>
              Event link
            </Typography.TitleBold>
            <div className={styles.eventInfo__row}>
              <TextWithMention
                mentionees={[]}
                textClassName={styles.eventInfo__link}
                data={{ text: event.externalUrl || '' }}
              />
              <CopyButton text={event.externalUrl || ''} toast="Link copied" />
            </div>
          </div>
        ) : (
          <div className={styles.eventInfo__container}>
            <div>
              <Typography.TitleBold className={styles.eventInfo__text}>
                Live stream
              </Typography.TitleBold>
              {event.status === AmityEventStatus.Scheduled && (
                <Typography.Caption className={styles.eventInfo__subTitle}>
                  You can start setting up live 15 minutes before the event starts.
                </Typography.Caption>
              )}
            </div>
            <LiveStreamContent
              parentPost={event.post!}
              roomId={event.room?.roomId}
              className={styles.eventInfo__livestream}
              goToPostDetail={(context) => {
                AmityEventDetailPageBehavior?.goToPostDetailPage?.({
                  postId: event?.postId,
                  commentId: context?.commentId,
                  parentId: context?.parentId,
                  eventCreatorId: event.userId,
                  selectedReplyComment: context?.selectedReplyComment,
                  showReplyCommentAt: context?.showReplyCommentAt,
                });
              }}
            />
          </div>
        )
      ) : (
        <div className={styles.eventInfo__container}>
          <Typography.TitleBold className={styles.eventInfo__text}>
            Event address
          </Typography.TitleBold>
          <div className={styles.eventInfo__row}>
            <TextWithMention
              mentionees={[]}
              textClassName={styles.eventInfo__text}
              data={{ text: event.location || '' }}
            />
            <CopyButton text={event.location || ''} toast="Address copied" />
          </div>
        </div>
      )}
    </section>
  );
}
