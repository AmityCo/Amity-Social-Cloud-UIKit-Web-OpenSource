import React from 'react';
import PropTypes from 'prop-types';
import { toHumanString } from 'human-readable-numbers';
import Truncate from 'react-truncate-markup';

import { ConditionalRender } from '~/core/components/ConditionalRender';
import { customizableComponent } from '~/core/hocs/customization';
import Avatar from '~/core/components/Avatar';
import CommunityName from '~/social/components/CommunityName';
import {
  Count,
  Container,
  Header,
  Options,
  CategoriesList,
  Description,
  JoinButton,
  PlusIcon,
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
  onEditCommunityClick,
  joinCommunity,
  leaveCommunity,
}) => (
  <Container>
    <Header>
      <Avatar avatar={avatarFileUrl} size="big" />
      {isJoined && (
        <Options
          options={[
            canEditCommunity && {
              name: 'Settings',
              action: () => onEditCommunityClick(communityId),
            },
            { name: 'Leave Community', action: () => leaveCommunity(communityId) },
          ].filter(Boolean)}
        />
      )}
    </Header>
    <CommunityName communityId={communityId} isTitle />
    <CategoriesList>{communityCategories.join(', ')}</CategoriesList>
    <CountsContainer>
      <Count>
        <span className="countNumber">{toHumanString(postsCount)}</span> posts
      </Count>
      <Count>
        <span className="countNumber">{toHumanString(membersCount)}</span> members
      </Count>
    </CountsContainer>
    <Truncate lines={3}>
      <Description>{description}</Description>
    </Truncate>
    <ConditionalRender condition={!isJoined}>
      <JoinButton onClick={() => joinCommunity(communityId)}>
        <PlusIcon /> Join
      </JoinButton>
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
  onEditCommunityClick: PropTypes.func,
  joinCommunity: PropTypes.func,
  leaveCommunity: PropTypes.func,
};

export default customizableComponent('UICommunityInfo', UICommunityInfo);
