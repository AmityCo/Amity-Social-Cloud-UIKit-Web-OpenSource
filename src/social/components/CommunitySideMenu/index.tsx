import React from 'react';
import styled from 'styled-components';
import SideMenu from '~/core/components/SideMenu';
import SideSectionCommunity from '~/social/components/SideSectionCommunity';
import SideSectionMyCommunity from '~/social/components/SideSectionMyCommunity';
import UiKitSocialSearch from '~/social/components/SocialSearch';

const SocialSearch = styled(UiKitSocialSearch)`
  background: ${({ theme }) => theme.palette.system.background};
  padding: 0.5rem;
`;

export interface CommunitySideMenuProps {
  className?: string;
  activeCommunity?: string;
}

const CommunitySideMenu = ({ className, activeCommunity }: CommunitySideMenuProps) => (
  <SideMenu data-qa-anchor="community-side-menu" className={className}>
    <SocialSearch sticky searchBy="communities" />

    <SideSectionCommunity />

    <SideSectionMyCommunity activeCommunity={activeCommunity} />
  </SideMenu>
);

export default CommunitySideMenu;
