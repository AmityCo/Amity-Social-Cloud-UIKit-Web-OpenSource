import { Pencil } from '~/v4/icons/Pencil';
import Trash from '~/v4/social/icons/trash';
import { Typography } from '~/v4/core/components';
import { EventSetupMode } from '~/v4/social/features';
import { Popover } from '~/v4/core/components/AriaPopover';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { checkIsWithinMinutes } from '~/v4/social/utils/timezone';
import { BackButton, MenuButton, Menu } from '~/v4/social/elements';
import { useEventPermission } from '~/v4/social/features/events/hooks';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useEventActions } from '~/v4/social/features/events/EventDetail/hooks';
import styles from './EventActions.module.css';

export type EventActionsProps = {
  event: Amity.Event;
  withTitle?: boolean;
  pop?: number;
};

export function EventActions({ event, withTitle, pop = 1 }: EventActionsProps) {
  const { onBack } = useNavigation();
  const { info } = useConfirmContext();
  const { deleteEvent } = useEventActions();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { AmityEventDetailPageBehavior } = usePageBehavior();
  const { hasDeleteEventPermission, hasUpdateEventPermission } = useEventPermission(event.originId);

  const actions = [
    {
      key: 'edit',
      Icon: Pencil,
      label: 'Edit event',
      condition: hasUpdateEventPermission,
      onPress: () => {
        if (checkIsWithinMinutes(event.startTime)) {
          info({
            okText: 'OK',
            title: 'Editing is not possible',
            content:
              'You can no longer edit this event. Changes are restricted 15 minutes before the start time.',
          });
        } else {
          AmityEventDetailPageBehavior?.goToEventSetupPage({
            mode: EventSetupMode.EDIT,
            event,
          });
        }
      },
    },
    {
      Icon: Trash,
      danger: true,
      key: 'delete',
      label: 'Delete event',
      condition: hasDeleteEventPermission,
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
