import React, { useState, useEffect } from 'react';
import { customizableComponent } from '../hoks/customization';

import { Container, Header, Footer, Content, RightIcon } from './styles';

const CommunityAbout = ({ onChannelClick, selectedChannelId }) => (
  <Container>
    <Header>About</Header>
    <Content>
      Take your place in the magical universe of Harry Poter. Everyone's welcome and feel free to
      join!
    </Content>
    <Footer>
      View all <RightIcon />
    </Footer>
  </Container>
);

export default customizableComponent('CommunityAbout')(CommunityAbout);
