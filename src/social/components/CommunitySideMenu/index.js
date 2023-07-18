import PropTypes from 'prop-types';
import styled from 'styled-components';
import SideMenu from '~/core/components/SideMenu';
import SideSectionCommunity from '~/social/components/SideSectionCommunity';
import SideSectionMyCommunity from '~/social/components/SideSectionMyCommunity';
import UiKitSocialSearch from '~/social/components/SocialSearch';

export const SocialSearch = styled(UiKitSocialSearch)`
  background: ${({ theme }) => theme.palette.system.background};
  padding: 0.5rem;
`;

const CommunitySideMenu = ({ className, activeCommunity }) => (
  <SideMenu data-qa-anchor="community-side-menu" className={className}>
    <SocialSearch sticky />

    <SideSectionCommunity />

    <SideSectionMyCommunity activeCommunity={activeCommunity} showCreateButton />
  </SideMenu>
);

CommunitySideMenu.propTypes = {
  className: PropTypes.string,
  activeCommunity: PropTypes.string,
};

export default CommunitySideMenu;
