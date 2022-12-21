import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box } from '@noom/wax-component-library';
import SideMenu from '~/core/components/SideMenu';
import SideSectionCommunity from '~/social/components/SideSectionCommunity';
import SideSectionMyCommunity from '~/social/components/SideSectionMyCommunity';
import UiKitSocialSearch from '~/social/components/SocialSearch';
import { useConfig } from '~/social/providers/ConfigProvider';

const SocialSearch = styled(UiKitSocialSearch)`
  padding: 0.5rem 0;
`;

export type CommunitySideMenuProps = {
  showCreateButton?: boolean;
  canCreatePublicCommunity?: boolean;
};

const CommunitySideMenu = ({ className, activeCommunity, activePage, communityListProps }) => {
  const { showCreatePublicCommunityOption } = useConfig();

  return (
    <SideMenu className={className} data-qa-anchor="community-side-menu">
      <SocialSearch sticky />

      <SideSectionCommunity activePage={activePage} />
      <Box flex={1} minH={0}>
        <SideSectionMyCommunity
          activeCommunity={activeCommunity}
          communityListProps={communityListProps}
          canCreatePublicCommunity={showCreatePublicCommunityOption}
        />
      </Box>
    </SideMenu>
  );
};

CommunitySideMenu.propTypes = {
  className: PropTypes.string,
  activeCommunity: PropTypes.string,
};

export default CommunitySideMenu;
