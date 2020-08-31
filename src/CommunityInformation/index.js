import React, { useState, useEffect } from 'react';
import { customizableComponent } from '../hoks/customization';

import { confirm } from '../commonComponents/Confirm';
import { useCommunitiesMock } from '../mock';

import { Avatar, Container, CommunityName, Header, Options, Category } from './styles';

const CommunityInformation = ({ community, onChannelClick }) => {
  const { isPrivate, name, postsCount, membersCount } = community;

  const todo = () => console.log('TODO');
  const { leaveCommunity } = useCommunitiesMock();

  const leaveConfirm = () =>
    confirm({
      title: 'Leave community?',
      content: 'You won’t no longer be able to post and interact in this community after leaving.',
      okText: 'Leave',
      onOk: () => leaveCommunity(community.communityId),
    });

  return (
    <Container>
      <Header>
        <Avatar avatar={community.avatar} />
        <Options
          options={[
            { name: 'Edit community', action: todo },
            { name: 'Leave Community', action: leaveConfirm },
          ]}
        />
      </Header>
      <CommunityName>{name}</CommunityName>
      <Category>Category</Category>
    </Container>
  );
};

export default customizableComponent('CommunityInformation')(CommunityInformation);
