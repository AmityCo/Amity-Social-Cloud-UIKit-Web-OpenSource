import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import SideMenu, {
  SideMenuCloseButton,
  SideMenuCloseIcon,
  SideMenuHeader,
  SideMenuTitle,
} from '~/core/components/SideMenu';

import SideSectionCommunity from '~/social/components/SideSectionCommunity';
import SideSectionMyCommunity from '~/social/components/SideSectionMyCommunity';
import UiKitSocialSearch from '~/social/components/SocialSearch';

const SocialSearch = styled(UiKitSocialSearch)`
  background: ${({ theme }) => theme.palette.system.background};
  padding: 0.5rem;
`;

interface CommunitySideMenuProps {
  className?: string;
  activeCommunity?: string;
  onClose?: () => void;
}

const CommunitySideMenu = ({ className, activeCommunity, onClose }: CommunitySideMenuProps) => {
  const { formatMessage } = useIntl();
  return (
    <SideMenu data-qa-anchor="community-side-menu" className={className}>
      <SideMenuHeader>
        <SideMenuCloseButton>
          <SideMenuCloseIcon onClick={onClose} />
        </SideMenuCloseButton>
        <SideMenuTitle>{formatMessage({ id: 'sidebar.community' })}</SideMenuTitle>
      </SideMenuHeader>
      <SocialSearch sticky searchBy="communities" />
      <SideSectionCommunity />
      <SideSectionMyCommunity activeCommunity={activeCommunity} />
    </SideMenu>
  );
};

export default CommunitySideMenu;
