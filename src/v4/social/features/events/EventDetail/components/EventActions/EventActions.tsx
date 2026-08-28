import { Pencil } from '~/v4/icons/Pencil';
import { useString } from '~/v4/core/localization';
import { resolveString } from '~/v4/core/localization';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import Trash from '~/v4/social/icons/trash';
import { Typography } from '~/v4/core/components';
import { EventSetupMode } from '~/v4/social/features';
import { Popover } from '~/v4/core/components/AriaPopover';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { checkIsWithinMinutes } from '~/v4/social/utils/timezone';
import { BackButton, MenuButton } from '~/v4/social/elements';
import { Menu } from '~/v4/core/components/Menu';
import {
  useEventPermission,
  useRedirectEventPostTargetSelectionPage,
} from '~/v4/social/features/events/hooks';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useEventActions } from '~/v4/social/features/events/EventDetail/hooks';
import styles from './EventActions.module.css';
import { AddCalendar } from '~/v4/icons/AddCalendar';
import { downloadICS } from '~/v4/social/utils/downloadICS';
import {
  AmityEventResponseStatus,
  AmityEventStatus,
  AmitySharableContentType,
} from '@amityco/ts-sdk';
import useSDK from '~/v4/core/hooks/useSDK';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useSharableLink } from '~/v4/social/hooks/useSharableLink';
import { CopyToClipboard } from '~/v4/icons/CopyToClipboard';
import { PostEventToFeed } from '~/v4/icons/PostEventToFeed';

export type EventActionsProps = {
  event: Amity.Event;
  withTitle?: boolean;
  pop?: number;
  myRSVP?: Amity.EventResponse | null;
};

export function EventActions({ event, withTitle, pop = 1, myRSVP }: EventActionsProps) {
  const { onBack } = useNavigation();
  const { redirectEventPostTargetSelectionPage } = useRedirectEventPostTargetSelectionPage();
  const { info } = useConfirmContext();
  const { deleteEvent } = useEventActions();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { AmityEventDetailPageBehavior } = usePageBehavior();
  const { hasDeleteEventPermission } = useEventPermission(event.originId);
  const { currentUserId, isVisitorOrBot } = useSDK();

  const { config: createEventPostConfig, resolveText: resolveCreateEventPostText } =
    useAmityElement({
      pageId: 'event_detail_page',
      componentId: '*',
      elementId: 'create_event_post_button',
    });

  const isHostEvent = event.creator?.userId === currentUserId;

  const notification = useNotifications();

  const {
    link: shareableLink,
    isEnabled: isSharableLinkEnabled,
    isLoading: isSharableLinkLoading,
  } = useSharableLink({
    model: AmitySharableContentType.EVENT,
    referenceId: event.eventId,
  });

  const isPublicCommunity = event.targetCommunity?.isPublic ?? false;
  const isCommunityMember = event.targetCommunity && event.targetCommunity.isJoined;
  const isShareableStatus = event.status !== AmityEventStatus.Cancelled;
  const showCopyLink =
    isSharableLinkEnabled &&
    !!shareableLink &&
    !isSharableLinkLoading &&
    event.isOriginPublic &&
    isPublicCommunity &&
    isShareableStatus;

  const actions = [
    {
      key: 'edit',
      icon: Pencil,
      label: useString('amity_social_button_edit_event'),
      condition: isHostEvent,
      onPress: () => {
        if (checkIsWithinMinutes(event.startTime)) {
          info({
            okText: useString('amity_social_button_ok'),
            title: useString('amity_social_label_editing_is_not_possible'),
            content: useString(
              'amity_social_label_you_can_no_longer_edit_this_event_changes_are_restricte',
            ),
          });
        } else {
          AmityEventDetailPageBehavior?.goToEventSetupPage?.({
            mode: EventSetupMode.EDIT,
            event,
          });
        }
      },
    },
    {
      key: 'post-event-to-feed',
      icon: createEventPostConfig.image
        ? () => (
            <img
              src={createEventPostConfig.image}
              alt=""
              className={styles.eventActions__postEventToFeedIcon}
            />
          )
        : PostEventToFeed,
      iconClassName: styles.eventActions__postEventToFeedIcon,
      label: resolveCreateEventPostText('amity_social_button_event_post_create'),
      condition:
        !isVisitorOrBot &&
        event.status !== AmityEventStatus.Cancelled &&
        !event.isDeleted &&
        isCommunityMember,
      onPress: () => {
        redirectEventPostTargetSelectionPage(event);
      },
    },
    {
      key: 'add-to-calendar',
      icon: AddCalendar,
      label: useString('amity_social_modal_add_calendar_sheet_add_button'),
      condition:
        (isHostEvent || myRSVP?.status === AmityEventResponseStatus.Going) &&
        event.status !== 'ended',
      onPress: () => {
        downloadICS(event);
      },
    },
    {
      key: 'copy-event-link',
      icon: CopyToClipboard,
      label: useString('amity_social_button_copy_event_link'),
      condition: showCopyLink,
      onPress: async () => {
        if (!shareableLink) {
          notification.info({
            content: resolveString('amity_social_failed_to_copy_link'),
          });
          return;
        }
        try {
          await navigator.clipboard.writeText(shareableLink);
          notification.success({
            content: resolveString('amity_social_button_link_copied'),
          });
        } catch {
          notification.info({
            content: resolveString('amity_social_failed_to_copy_link'),
          });
        }
      },
    },
    {
      icon: Trash,
      destructive: true,
      key: 'delete',
      label: useString('amity_social_button_delete_event'),
      condition: hasDeleteEventPermission || isHostEvent,
      onPress: () => deleteEvent(event.eventId),
    },
  ].filter((action) => action.condition);

  return (
    <div className={styles.eventActions}>
      <div className={styles.eventActions__headerLeft}>
        <div>
          <BackButton onPress={() => onBack(pop)} variant="filled" />
        </div>
        {withTitle && (
          <Typography.TitleBold className={styles.eventActions__eventTitle}>
            {event?.title}
          </Typography.TitleBold>
        )}
      </div>
      {actions.length > 0 && (
        <Popover
          trigger={({ openPopover, isDesktop }) => (
            <MenuButton
              variant="filled"
              onClick={() => {
                isDesktop
                  ? openPopover()
                  : setDrawerData({
                      content: (
                        <Menu container="drawer">
                          {actions.map(({ onPress, ...action }) => (
                            <Menu.Item
                              {...action}
                              onPress={() => {
                                onPress();
                                removeDrawerData();
                              }}
                            />
                          ))}
                        </Menu>
                      ),
                    });
              }}
            />
          )}
        >
          {({ closePopover }) => (
            <Menu>
              {actions.map(({ onPress, key, ...action }) => {
                return (
                  <Menu.Item
                    {...action}
                    key={key}
                    onPress={() => {
                      onPress();
                      closePopover();
                    }}
                  />
                );
              })}
            </Menu>
          )}
        </Popover>
      )}
    </div>
  );
}
