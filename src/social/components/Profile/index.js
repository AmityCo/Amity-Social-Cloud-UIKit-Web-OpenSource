import React from 'react';
import { toHumanString } from 'human-readable-numbers';

import ConditionalRender from '~/core/components/ConditionalRender';
import Button from '~/core/components/Button';
import useUser from '~/core/hooks/useUser';
import withSDK from '~/core/hocs/withSDK';

import {
  Count,
  Avatar,
  Container,
  ProfileName,
  Header,
  Description,
  MessageIcon,
  PencilIcon,
} from './styles';

const DEFAULT_DISPLAY_NAME = 'Anonymous';

const UserProfileBar = ({ userId, currentUserId, editProfile = () => {}, goToChat = () => {} }) => {
  const { user } = useUser(userId);
  const { avatarFileId, displayName, description } = user;

  const isMyProfile = userId === currentUserId;

  return (
    <Container>
      <Header>
        <Avatar avatar={avatarFileId} />
      </Header>
      <ProfileName>{displayName || DEFAULT_DISPLAY_NAME}</ProfileName>
      <div>
        {/* TODO: need method for getting posts amount for current user */}
        <Count>{toHumanString(0)}</Count> posts
      </div>
      <Description>{description}</Description>
      <ConditionalRender condition={isMyProfile}>
        <Button fullWidth onClick={() => editProfile(userId)}>
          <PencilIcon /> Edit profile
        </Button>
        <Button fullWidth onClick={() => goToChat(userId)}>
          <MessageIcon /> Message
        </Button>
      </ConditionalRender>
    </Container>
  );
};

export default withSDK(UserProfileBar);
