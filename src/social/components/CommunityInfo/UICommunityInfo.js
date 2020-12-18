import React from 'react';
import PropTypes from 'prop-types';
import { toHumanString } from 'human-readable-numbers';
import Truncate from 'react-truncate-markup';
import { FormattedMessage } from 'react-intl';

import ConditionalRender from '~/core/components/ConditionalRender';
import customizableComponent from '~/core/hocs/customization';
import Avatar from '~/core/components/Avatar';
import CommunityName from '~/social/components/community/Name';
import Button from '~/core/components/Button';
import { backgroundImage as CommunityImage } from '~/icons/Community';
import {
  Count,
  Container,
  Header,
  OptionMenu,
  CategoriesList,
  Description,
  JoinButton,
  PlusIcon,
  PencilIcon,
  CountsContainer,
} from './styles';

// TODO: react-intl
// Translations for options buttons, join button, counts.

const UICommunityInfo = ({
  communityId,
  communityCategories,
  postsCount,
  membersCount,
  description,
  isJoined,
  avatarFileUrl,
  canEditCommunity,
  onEditCommunity,
  joinCommunity,
  leaveCommunity,
  canLeaveCommunity,
}) => (
  <Container>
    <Header>
      <Avatar avatar={avatarFileUrl} size="big" backgroundImage={CommunityImage} />
      <ConditionalRender condition={isJoined}>
        <OptionMenu
          options={[
            canEditCommunity && {
              name: 'Settings',
              action: () => onEditCommunity(communityId),
            },
            canLeaveCommunity && {
              name: 'Leave Community',
              action: () => leaveCommunity(communityId),
            },
          ].filter(Boolean)}
        />
      </ConditionalRender>
    </Header>
    <CommunityName communityId={communityId} isTitle />
    <CategoriesList>{(communityCategories || []).join(', ')}</CategoriesList>
    <CountsContainer>
      <Count>
        <span className="countNumber">{toHumanString(postsCount || 0)}</span> posts
      </Count>
      <Count>
        <span className="countNumber">{toHumanString(membersCount || 0)}</span> members
      </Count>
    </CountsContainer>
    <Truncate lines={3}>
      <Description>{description}</Description>
    </Truncate>
    <ConditionalRender condition={!isJoined}>
      <JoinButton onClick={() => joinCommunity(communityId)}>
        <PlusIcon /> <FormattedMessage id="community.join" />
      </JoinButton>
    </ConditionalRender>
    <ConditionalRender condition={isJoined && canEditCommunity}>
      <Button fullWidth onClick={() => onEditCommunity(communityId)}>
        <PencilIcon /> <FormattedMessage id="community.editProfile" />
      </Button>
    </ConditionalRender>
  </Container>
);

UICommunityInfo.propTypes = {
  communityId: PropTypes.string.isRequired,
  communityCategories: PropTypes.arrayOf(PropTypes.string),
  postsCount: PropTypes.number,
  membersCount: PropTypes.number,
  description: PropTypes.string,
  isJoined: PropTypes.bool,
  avatarFileUrl: PropTypes.string,
  canEditCommunity: PropTypes.bool,
  onEditCommunity: PropTypes.func,
  joinCommunity: PropTypes.func,
  leaveCommunity: PropTypes.func,
  canLeaveCommunity: PropTypes.bool,
};

export default customizableComponent('UICommunityInfo', UICommunityInfo);
