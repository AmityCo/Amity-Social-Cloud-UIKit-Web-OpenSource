import React from 'react';
import PropTypes from 'prop-types';
import { toHumanString } from 'human-readable-numbers';
import { FormattedMessage } from 'react-intl';

import ConditionalRender from '~/core/components/ConditionalRender';
import Button from '~/core/components/Button';
import customizableComponent from '~/core/hocs/customization';
import { backgroundImage as UserImage } from '~/icons/User';

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
  fileUrl,
  displayName,
  description,
  isMyProfile,
  postsCount,
  onEditUser,
  onMessageUser,
}) => {
  return (
    <Container>
      <Header>
        <Avatar avatar={fileUrl} backgroundImage={UserImage} />
      </Header>
      <ProfileName>{displayName}</ProfileName>
      <div>
        <Count>{toHumanString(postsCount)}</Count> posts
      </div>
      <Description>{description}</Description>
      <ConditionalRender condition={isMyProfile}>
        <Button fullWidth onClick={() => onEditUser(userId)}>
          <PencilIcon /> <FormattedMessage id="user.editProfile" />
        </Button>
        <Button fullWidth onClick={() => onMessageUser(userId)}>
          <MessageIcon /> <FormattedMessage id="user.message" />
        </Button>
      </ConditionalRender>
    </Container>
  );
};

UIUserProfileBar.propTypes = {
  userId: PropTypes.string,
  fileUrl: PropTypes.string,
  displayName: PropTypes.string,
  description: PropTypes.string,
  postsCount: PropTypes.number,
  isMyProfile: PropTypes.bool,
  onEditUser: PropTypes.func,
  onMessageUser: PropTypes.func,
};

UIUserProfileBar.defaultProps = {
  userId: '',
  fileUrl: '',
  displayName: '',
  description: '',
  postsCount: 0,
  isMyProfile: false,
  onEditUser: () => {},
  onMessageUser: () => {},
};

export default customizableComponent('UIUserProfileBar', UIUserProfileBar);
