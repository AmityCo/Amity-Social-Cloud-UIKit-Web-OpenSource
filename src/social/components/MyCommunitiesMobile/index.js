import SideSectionMyCommunity from '~/social/components/SideSectionMyCommunity';
import { Container, MobileCommunitiesHeader } from './styles';

const MyCommunitiesMobile = () => {
  return (
    <Container>
      <MobileCommunitiesHeader>My Groups</MobileCommunitiesHeader>

      <SideSectionMyCommunity />
    </Container>
  );
};

export default MyCommunitiesMobile;
