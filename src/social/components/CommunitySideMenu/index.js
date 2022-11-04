import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box } from '@noom/wax-component-library';
import SideMenu from '~/core/components/SideMenu';
import SideSectionCommunity from '~/social/components/SideSectionCommunity';
import SideSectionMyCommunity from '~/social/components/SideSectionMyCommunity';
import UiKitSocialSearch from '~/social/components/SocialSearch';

const SocialSearch = styled(UiKitSocialSearch)`
  padding: 0.5rem 0;
`;

const CommunitySideMenu = ({ className, activeCommunity, activePage, communityListProps }) => (
  <SideMenu className={className}>
    <SocialSearch sticky />

    <SideSectionCommunity activePage={activePage} />
    <Box flex={1} minH={0}>
      <SideSectionMyCommunity
        activeCommunity={activeCommunity}
        communityListProps={communityListProps}
        showCreateButton
      />
    </Box>
  </SideMenu>
);

CommunitySideMenu.propTypes = {
  className: PropTypes.string,
  activeCommunity: PropTypes.string,
};

export default CommunitySideMenu;
