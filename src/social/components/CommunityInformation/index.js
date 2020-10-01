import React from 'react';
import { toHumanString } from 'human-readable-numbers';
import Truncate from 'react-truncate-markup';
import { confirm } from '~/core/components/Confirm';
import { ConditionalRender } from '~/core/components/ConditionalRender';
import { customizableComponent } from '~/core/hocs/customization';
import { backgroundImage as CommunityImage } from '~/icons/Community';

import { useCommunitiesMock, getMyCommunityIds } from '~/mock';

import {
  Count,
  Avatar,
  Container,
  CommunityName,
  CommunityNameContainer,
  Header,
  Options,
  Category,
  Description,
  JoinButton,
  PlusIcon,
} from './styles';
import { PrivateIcon } from '../CommunityName/styles';

const CommunityInformation = ({ community, onEditCommunityClick }) => {
  const { name } = community;

  const { joinCommunity, leaveCommunity } = useCommunitiesMock();

  const leaveConfirm = () =>
    confirm({
      title: 'Leave community?',
      content: 'You won’t no longer be able to post and interact in this community after leaving.',
      okText: 'Leave',
      onOk: () => leaveCommunity(community.communityId),
    });

  const myCommunityIds = getMyCommunityIds();

  const isMine = myCommunityIds.includes(community.communityId);

  return (
    <Container>
      <Header>
        <Avatar avatar={community.avatar} backgroundImage={CommunityImage} />
        <Options
          options={[
            { name: 'Settings', action: () => onEditCommunityClick(community.communityId) },
            { name: 'Leave Community', action: leaveConfirm },
          ]}
        />
      </Header>
      <CommunityNameContainer>
        <ConditionalRender condition={!community.isPublic}>
          <PrivateIcon />
        </ConditionalRender>
        <CommunityName>{name}</CommunityName>
      </CommunityNameContainer>
      <Category>Category</Category>
      <div>
        <Count>{toHumanString(community.postsCount)}</Count> posts
        <Count>{toHumanString(community.postsCount)}</Count> members
      </div>
      <Truncate lines={3}>
        <Description>{community.description}</Description>
      </Truncate>
      <ConditionalRender condition={!isMine}>
        <JoinButton onClick={() => joinCommunity(community.communityId)}>
          <PlusIcon /> Join
        </JoinButton>
      </ConditionalRender>
    </Container>
  );
};

export default customizableComponent('CommunityInformation', CommunityInformation);
