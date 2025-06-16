import React from 'react';
import User from '~/v4/icons/User';
import { Avatar, Typography } from '~/v4/core/components';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import {
  JoinButton,
  RejectButton,
  JoinRequestsTabDescription,
  UserAvatar,
} from '~/v4/social/elements';
import styles from './JoinRequestContent.module.css';
import FireworkPaper from '~/v4/icons/FireworkPaper';
import { useJoinRequests } from '~/v4/social/hooks/useJoinRequests';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { UserListSkeleton } from '~/v4/core/components/UserListSkeleton';

type JoinRequestContentProps = {
  pageId?: string;
  joinRequests: Amity.JoinRequest[] | null;
  isLoading: boolean;
};

export const JoinRequestContent = ({
  pageId = '*',
  joinRequests = [],
  isLoading,
}: JoinRequestContentProps) => {
  const componentId = 'join_request_content';

  const { accessibilityId, themeStyles } = useAmityComponent({
    componentId,
    pageId,
  });

  const { goToUserProfilePage } = useNavigation();

  const { approveJoinRequest, declineJoinRequest } = useJoinRequests();

  const onClickAccept = (joinRequest: Amity.JoinRequest) => approveJoinRequest(joinRequest);
  const onClickReject = (joinRequest: Amity.JoinRequest) => declineJoinRequest(joinRequest);

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <JoinRequestsTabDescription pageId={pageId} componentId={componentId} />

      {isLoading && (
        <div className={styles.joinRequestContent__skeletonContainer}>
          {Array.from({ length: 3 }).map((_, index) => (
            <UserListSkeleton key={index} />
          ))}
        </div>
      )}
      {joinRequests &&
        joinRequests.length > 0 &&
        joinRequests.map((joinRequest) => (
          <div className={styles.joinRequestContent__container}>
            <div className={styles.joinRequestContent__content}>
              <UserAvatar
                pageId={pageId}
                componentId={componentId}
                className={styles.joinRequestContent__avatar}
                userId={joinRequest.user?.userId}
                onPressAvatar={() => goToUserProfilePage(joinRequest.user?.userId as string)}
              />
              <Typography.BodyBold
                className={styles.joinRequestContent__username}
                onClick={() => goToUserProfilePage(joinRequest.user?.userId as string)}
              >
                {joinRequest.user?.displayName}
              </Typography.BodyBold>
            </div>
            <div className={styles.joinRequestContent__button}>
              <JoinButton
                pageId={pageId}
                componentId={componentId}
                elementId="join_accept_button"
                onPress={() => onClickAccept(joinRequest)}
              />
              <RejectButton
                pageId={pageId}
                componentId={componentId}
                elementId="join_decline_button"
                onPress={() => onClickReject(joinRequest)}
              />
            </div>
          </div>
        ))}

      {!isLoading && joinRequests && joinRequests.length === 0 && (
        <div className={styles.joinRequestContent__noJoinRequest}>
          <FireworkPaper className={styles.joinRequestContent__fireworkIcon} />
          <Typography.TitleBold className={styles.joinRequestContent__noJoinRequestText}>
            No pending requests
          </Typography.TitleBold>
        </div>
      )}
    </div>
  );
};
