import React, { useState, useEffect } from 'react';
import { customizableComponent } from '../hoks/customization';
import Options from '../commonComponents/Options';

import { Avatar, Container, CommunityName, Header, Footer, Content, RightIcon } from './styles';

const testCommunity = {
  private: true,
  name: 'Harry Poter Fans',
  postsCount: 345,
  membersCount: 4501,
};

const CommunityInformation = ({ community = testCommunity, onChannelClick, selectedChannelId }) => {
  const { private, name, postsCount, membersCount } = community;

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
      {/* <Content> */}
      {/*   Take your place in the magical universe of Harry Poter. Everyone's welcome and feel free to */}
      {/*   join! */}
      {/* </Content> */}
      {/* <Footer> */}
      {/*   View all <RightIcon /> */}
      {/* </Footer> */}
    </Container>
  );
};

export default customizableComponent('CommunityInformation')(CommunityInformation);
