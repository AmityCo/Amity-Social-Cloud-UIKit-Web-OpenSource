import React from 'react';
import { Container, MobileCommunitiesHeader } from './styles';
import SideSectionMyCommunity from '~/social/components/SideSectionMyCommunity';

const MyCommunitiesMobile = () => {
  return (
    <Container>
      <MobileCommunitiesHeader>My Groups</MobileCommunitiesHeader>

      <SideSectionMyCommunity />
    </Container>
  );
};

export default MyCommunitiesMobile;
