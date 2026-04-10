import { Button } from '~/v4/core/components/AriaButton';
import styles from './RSVPButton.module.css';
import { BellTransparent } from '~/v4/icons/BellTransparent';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { MemberBottomSheet } from './MemberBottomSheet';
import { NonMemberBottomSheet } from './NonMemberBottomSheet';
import { AmityEventResponseStatus, AmityEventStatus } from '@amityco/ts-sdk';
import { Dispatch, SetStateAction } from 'react';
import { Check } from '~/icons';
import CloseIcon from '~/v4/icons/Close';
import { UpdateStatusBottomSheet } from './UpdateStatusBottomSheet';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { Popover } from '~/v4/core/components/AriaPopover';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useRSVP } from '~/v4/social/features/events/hooks/useRSVP';
import { downloadICS } from '~/v4/social/utils/downloadICS';
import useCommunity from '~/v4/social/hooks/objects/useCommunity';

type RSVPButtonProps = {
  event: Amity.Event;
  myRSVP?: Amity.EventResponse;
  setMyRSVP: Dispatch<SetStateAction<Amity.EventResponse | undefined>>;
  onRefresh?: () => void;
};

export const RSVPButton = ({ event, myRSVP, setMyRSVP, onRefresh }: RSVPButtonProps) => {
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { createRSVP, updateRSVP } = useRSVP({ event });
  const { error } = useNotifications();
  const { info } = useConfirmContext();
  const { currentUserId } = useSDK();
  const { isDesktop } = useResponsive();
  const { openPopup, closePopup } = usePopupContext();
  const { community } = useCommunity({ communityId: event.targetCommunity?.communityId });

  const isDisabledStatusButton = event.status !== AmityEventStatus.Scheduled;

  const { isVisitorOrBot } = useSDK();

  const handleAddToCalendar = () => {
    downloadICS(event);
    isDesktop ? closePopup() : removeDrawerData();
  };

  const handleStatusChange = async (
    status: AmityEventResponseStatus,
    closeCallback: () => void,
  ) => {
    closeCallback();
    if (event.status === AmityEventStatus.Live) {
      removeDrawerData();
    }
    const updatedRSVP = await updateRSVP(status);
    removeDrawerData();
    setMyRSVP(updatedRSVP);
    if (status === AmityEventResponseStatus.Going) {
      if (isDesktop) {
        openPopup({
          children: ({ close }) => (
            <MemberBottomSheet onPressAddToCalendar={handleAddToCalendar} onClose={close} />
          ),
        });
      } else {
        setDrawerData({
          content: (
            <MemberBottomSheet
              onPressAddToCalendar={handleAddToCalendar}
              onClose={removeDrawerData}
            />
          ),
        });
      }
    }
  };

  const handleMemberClick = async () => {
    const response = await createRSVP(AmityEventResponseStatus.Going);
    setMyRSVP(response);
    if (isDesktop) {
      openPopup({
        children: ({ close }) => (
          <MemberBottomSheet onPressAddToCalendar={handleAddToCalendar} onClose={close} />
        ),
      });
      return;
    } else {
      setDrawerData({
        content: (
          <MemberBottomSheet
            onPressAddToCalendar={handleAddToCalendar}
            onClose={removeDrawerData}
          />
        ),
      });
    }
  };

  const handleJoinCommunity = async ({ onClose }: { onClose: () => void }) => {
    await community?.join();
    onClose();

    if (community?.requiresJoinApproval) {
      info({
        title: 'You’ll be able to RSVP once your join request is accepted',
        content:
          "Requested to join the community. You'll be notified once your request is accepted. ",
      });
    } else {
      const response = await createRSVP(AmityEventResponseStatus.Going);
      setMyRSVP(response);
      if (isDesktop) {
        openPopup({
          children: ({ close }) => (
            <MemberBottomSheet onPressAddToCalendar={handleAddToCalendar} onClose={close} />
          ),
        });
        return;
      }
      setDrawerData({
        content: (
          <MemberBottomSheet
            onPressAddToCalendar={handleAddToCalendar}
            onClose={removeDrawerData}
          />
        ),
      });
    }
  };

  const handleNonMemberClick = () => {
    if (isDesktop) {
      openPopup({
        children: ({ close }) => (
          <NonMemberBottomSheet
            event={event}
            onPressJoin={() => handleJoinCommunity({ onClose: close })}
            onClose={close}
          />
        ),
      });
      return;
    }
    setDrawerData({
      content: (
        <NonMemberBottomSheet
          event={event}
          onPressJoin={() => handleJoinCommunity({ onClose: removeDrawerData })}
          onClose={removeDrawerData}
        />
      ),
    });
  };

  const changeStatusBottomSheet = () => {
    if (!isDesktop) {
      setDrawerData({
        content: (
          <UpdateStatusBottomSheet
            rsvp={myRSVP}
            onPressChangeStatus={async (status) => {
              await handleStatusChange(status, removeDrawerData);
              onRefresh?.();
            }}
          />
        ),
      });
    }
  };

  const handleVisitorClick = () => {
    info({
      content: 'Create an account or sign in to continue.',
    });
  };

  return (
    <div className={styles.rsvpButton__container}>
      {isDesktop ? (
        myRSVP?.status === AmityEventResponseStatus.Going ? (
          <Popover
            placement="bottom"
            containerClassName={styles.rsvpButton__popover}
            className={styles.rsvpButton__optionsPopover}
            trigger={({ openPopover }) => (
              <Button
                variant="outlined"
                onPress={openPopover}
                className={styles.rsvpButton__status}
                isDisabled={isDisabledStatusButton}
              >
                <Check
                  data-disabled={isDisabledStatusButton}
                  className={styles.rsvpButton__goingIcon}
                />
                Going
              </Button>
            )}
          >
            {({ closePopover }) => (
              <UpdateStatusBottomSheet
                rsvp={myRSVP}
                onPressChangeStatus={async (status) => {
                  await handleStatusChange(status, closePopover);
                  onRefresh?.();
                }}
              />
            )}
          </Popover>
        ) : myRSVP?.status === AmityEventResponseStatus.NotGoing ? (
          <Popover
            placement="bottom"
            containerClassName={styles.rsvpButton__popover}
            className={styles.rsvpButton__optionsPopover}
            trigger={({ openPopover }) => (
              <Button
                variant="outlined"
                onPress={openPopover}
                className={styles.rsvpButton__status}
                isDisabled={isDisabledStatusButton}
              >
                <CloseIcon
                  data-disabled={isDisabledStatusButton}
                  className={styles.rsvpButton__goingIcon}
                />
                Not Going
              </Button>
            )}
          >
            {({ closePopover }) => (
              <UpdateStatusBottomSheet
                rsvp={myRSVP}
                onPressChangeStatus={async (status) => {
                  await handleStatusChange(status, closePopover);
                  onRefresh?.();
                }}
              />
            )}
          </Popover>
        ) : (
          event.status === AmityEventStatus.Scheduled &&
          event.userId !== currentUserId && (
            <Button
              onPress={
                isVisitorOrBot
                  ? handleVisitorClick
                  : community?.isJoined
                    ? handleMemberClick
                    : handleNonMemberClick
              }
              className={styles.rsvpButton}
            >
              <BellTransparent className={styles.rsvpButton__icon} />
              RSVP
            </Button>
          )
        )
      ) : myRSVP?.status === AmityEventResponseStatus.Going ? (
        <Button
          variant="outlined"
          onPress={changeStatusBottomSheet}
          className={styles.rsvpButton__status}
          isDisabled={isDisabledStatusButton}
        >
          <Check data-disabled={isDisabledStatusButton} className={styles.rsvpButton__goingIcon} />
          Going
        </Button>
      ) : myRSVP?.status === AmityEventResponseStatus.NotGoing ? (
        <Button
          variant="outlined"
          onPress={changeStatusBottomSheet}
          className={styles.rsvpButton__status}
          isDisabled={isDisabledStatusButton}
        >
          <CloseIcon
            data-disabled={isDisabledStatusButton}
            className={styles.rsvpButton__goingIcon}
          />
          Not Going
        </Button>
      ) : (
        event.status === AmityEventStatus.Scheduled &&
        event.userId !== currentUserId && (
          <Button
            onPress={
              isVisitorOrBot
                ? handleVisitorClick
                : community?.isJoined
                  ? handleMemberClick
                  : handleNonMemberClick
            }
            className={styles.rsvpButton}
          >
            <BellTransparent className={styles.rsvpButton__icon} />
            RSVP
          </Button>
        )
      )}
    </div>
  );
};
