import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ButtonsContainer, UserHeaderContainer } from '~/social/pages/UserFeed/Followers/styles';
import UserHeader from '~/social/components/UserHeader';
import useFollow from '~/core/hooks/useFollow';
import Button, { PrimaryButton } from '~/core/components/Button';
import withSDK from '~/core/hocs/withSDK';

const PendingItem = ({ currentUserId, userId }) => {
  const { followAccept, followDecline } = useFollow(currentUserId, userId);

  return (
    <UserHeaderContainer>
      <UserHeader userId={userId} />
      <ButtonsContainer>
        <PrimaryButton fullWidth onClick={followAccept}>
          <FormattedMessage id="request.accept" />
        </PrimaryButton>
        <Button fullWidth onClick={followDecline}>
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
