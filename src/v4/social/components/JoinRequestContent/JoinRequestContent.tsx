import React from 'react';
import User from '~/v4/icons/User';
import { Avatar, Typography } from '~/v4/core/components';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { JoinButton, RejectButton, JoinRequestsTabDescription } from '~/v4/social/elements';
import styles from './JoinRequestContent.module.css';
import FireworkPaper from '~/v4/icons/FireworkPaper';
import { useJoinRequests } from '~/v4/social/hooks/useJoinRequests';

type JoinRequestContentProps = {
  pageId?: string;
  joinRequests?: Amity.JoinRequest[];
};

export const JoinRequestContent = ({
  pageId = '*',
  joinRequests = [],
}: JoinRequestContentProps) => {
  const componentId = 'join_request_content';

  const { accessibilityId, themeStyles } = useAmityComponent({
    componentId,
    pageId,
  });

  const { approveJoinRequest, declineJoinRequest } = useJoinRequests();

  const onClickAccept = (joinRequest: Amity.JoinRequest) => approveJoinRequest(joinRequest);
  const onClickReject = (joinRequest: Amity.JoinRequest) => declineJoinRequest(joinRequest);

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <JoinRequestsTabDescription pageId={pageId} componentId={componentId} />

      {joinRequests.length > 0 &&
        joinRequests.map((joinRequest) => (
          <div className={styles.joinRequestContent__container}>
            <div className={styles.joinRequestContent__content}>
              <Avatar
                containerClassName={styles.joinRequestContent__avatar}
                avatarUrl={joinRequest.user?.avatar?.fileUrl}
                defaultImage={<User />}
              />
              <Typography.BodyBold className={styles.joinRequestContent__username}>
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

      {joinRequests.length === 0 && (
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
