import SideSectionMyCommunity from '~/social/components/SideSectionMyCommunity';
import { Container, MobileCommunitiesHeader } from './styles';

const MyCommunitiesMobile = () => {
  return (
    <Container className="mobile-communities-list">
      <MobileCommunitiesHeader>My Groups</MobileCommunitiesHeader>

      <SideSectionMyCommunity />
    </Container>
  );
};

export default MyCommunitiesMobile;
