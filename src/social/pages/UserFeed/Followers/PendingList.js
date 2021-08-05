import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ButtonsContainer, UserHeaderContainer } from '~/social/pages/UserFeed/Followers/styles';
import UserHeader from '~/social/components/UserHeader';
import useFollow from '~/core/hooks/useFollow';
import Button, { PrimaryButton } from '~/core/components/Button';
import withSDK from '~/core/hocs/withSDK';
import { notification } from '~/core/components/Notification';
import { useAsyncCallback } from '~/core/hooks/useAsyncCallback';

const PendingItem = ({ currentUserId, userId }) => {
  const { followAccept, followDecline } = useFollow(currentUserId, userId);

  const [onFollowAccept] = useAsyncCallback(async () => {
    await followAccept();
    notification.success({ content: <FormattedMessage id="notification.done" /> });
  }, [followAccept]);

  const [onFollowDecline] = useAsyncCallback(async () => {
    await followDecline();
    notification.success({ content: <FormattedMessage id="notification.done" /> });
  }, [followDecline]);

  return (
    <UserHeaderContainer>
      <UserHeader userId={userId} />
      <ButtonsContainer>
        <PrimaryButton fullWidth onClick={onFollowAccept}>
          <FormattedMessage id="request.accept" />
        </PrimaryButton>
        <Button fullWidth onClick={onFollowDecline}>
          <FormattedMessage id="request.decline" />
        </Button>
      </ButtonsContainer>
    </UserHeaderContainer>
  );
};

const PendingList = ({ currentUserId, pendingUsers }) => {
  return pendingUsers.map(user => (
    <PendingItem key={user.userId} userId={user.userId} currentUserId={currentUserId} />
  ));
};

export default withSDK(PendingList);
