import { Typography } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { COMPONENT_ID } from '~/v4/constants/customization';
import { AmityEventType } from '@amityco/ts-sdk';
import { CopyButton } from '~/v4/social/features/events/EventDetail/elements';
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
          {useString('amity_social_label_about_the_event')}
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
              {useString('amity_social_placeholder_event_link_hint')}
            </Typography.TitleBold>
            <div className={styles.eventInfo__row}>
              <TextWithMention
                mentionees={[]}
                textClassName={styles.eventInfo__link}
                data={{ text: event.externalUrl || '' }}
              />
              <CopyButton
                text={event.externalUrl || ''}
                toast={useString('amity_social_button_link_copied')}
              />
            </div>
          </div>
        ) : null
      ) : (
        <div className={styles.eventInfo__container}>
          <Typography.TitleBold className={styles.eventInfo__text}>
            {useString('amity_social_event_info_event_address')}
          </Typography.TitleBold>
          <div className={styles.eventInfo__row}>
            <TextWithMention
              mentionees={[]}
              textClassName={styles.eventInfo__text}
              data={{ text: event.location || '' }}
            />
            <CopyButton
              text={event.location || ''}
              toast={useString('amity_social_button_address_copied')}
            />
          </div>
        </div>
      )}
    </section>
  );
}
