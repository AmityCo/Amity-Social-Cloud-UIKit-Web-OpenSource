import React, { useState, useEffect } from 'react';
import { customizableComponent } from '../hoks/customization';
import Options from '../commonComponents/Options';

import { Avatar, Container, CommunityName, Header, Footer, Content, RightIcon } from './styles';

const testCommunity = {
  isPrivate: true,
  name: 'Harry Poter Fans',
  postsCount: 345,
  membersCount: 4501,
};

const CommunityInformation = ({ community = testCommunity, onChannelClick, selectedChannelId }) => {
  const { isPrivate, name, postsCount, membersCount } = community;

  const todo = () => console.log('TODO');

  return (
    <Container>
      <Header>
        <Avatar />
        <Options
          options={[
            { name: 'Edit community', action: todo },
            { name: 'Todo todo todo', action: todo },
          ]}
        />
      </Header>
      <CommunityName>{name}</CommunityName>
    </Container>
  );
};

export default customizableComponent('CommunityInformation')(CommunityInformation);
