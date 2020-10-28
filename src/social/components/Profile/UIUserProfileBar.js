import React from 'react';
import PropTypes from 'prop-types';
import { toHumanString } from 'human-readable-numbers';

import ConditionalRender from '~/core/components/ConditionalRender';
import Button from '~/core/components/Button';
import customizableComponent from '~/core/hocs/customization';
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

// TODO: react-intl
const UIUserProfileBar = ({
  userId,
  avatarFileId,
  displayName,
  description,
  isMyProfile,
  postsCount,
  editProfile,
  goToChat,
}) => {
  return (
    <Container>
      <Header>
        <Avatar avatar={avatarFileId} />
      </Header>
      <ProfileName>{displayName}</ProfileName>
      <div>
        <Count>{toHumanString(postsCount)}</Count> posts
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

UIUserProfileBar.propTypes = {
  userId: PropTypes.string,
  avatarFileId: PropTypes.string,
  displayName: PropTypes.string,
  description: PropTypes.string,
  postsCount: PropTypes.number,
  isMyProfile: PropTypes.bool,
  editProfile: PropTypes.func,
  goToChat: PropTypes.func,
};

UIUserProfileBar.defaultProps = {
  userId: '',
  avatarFileId: '',
  displayName: '',
  description: '',
  postsCount: 0,
  isMyProfile: false,
  editProfile: () => {},
  goToChat: () => {},
};

export default customizableComponent('UIUserProfileBar', UIUserProfileBar);
