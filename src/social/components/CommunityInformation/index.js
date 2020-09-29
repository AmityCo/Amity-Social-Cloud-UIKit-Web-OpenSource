import React from 'react';
import { toHumanString } from 'human-readable-numbers';
import Truncate from 'react-truncate-markup';
import { confirm } from '~/core/components/Confirm';
import { customizableComponent } from '~/core/hocs/customization';

import { useCommunitiesMock, getMyCommunityIds } from '~/mock';

import {
  Count,
  Avatar,
  Container,
  CommunityName,
  Header,
  Options,
  Category,
  Description,
  JoinButton,
  PlusIcon,
} from './styles';

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
        <Avatar avatar={community.avatar} />
        <Options
          options={[
            { name: 'Settings', action: () => onEditCommunityClick(community.communityId) },
            { name: 'Leave Community', action: leaveConfirm },
          ]}
        />
      </Header>
      <CommunityName>{name}</CommunityName>
      <Category>Category</Category>
      <div>
        <Count>{toHumanString(community.postsCount)}</Count> posts
        <Count>{toHumanString(community.postsCount)}</Count> members
      </div>
      <Truncate lines={3}>
        <Description>{community.description}</Description>
      </Truncate>
      {!isMine && (
        <JoinButton onClick={() => joinCommunity(community.communityId)}>
          <PlusIcon /> Join
        </JoinButton>
      )}
    </Container>
  );
};

export default customizableComponent('CommunityInformation', CommunityInformation);
