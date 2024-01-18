import React, { memo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import SideMenuActionItem from '~/core/components/SideMenuActionItem';
import SideMenuSection from '~/core/components/SideMenuSection';
import { Plus } from '~/icons';
import CommunitiesList from '~/social/components/CommunitiesList';
import CommunityCreationModal from '~/social/components/CommunityCreationModal';
import { useConfig } from '~/social/providers/ConfigProvider';
import { useNavigation } from '~/social/providers/NavigationProvider';

interface SideSectionMyCommunityProps {
  className?: string;
  activeCommunity?: string;
}

const SideSectionMyCommunity = ({ className, activeCommunity }: SideSectionMyCommunityProps) => {
  const { socialCommunityCreationButtonVisible } = useConfig();
  const { onCommunityCreated } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);

  const close = (communityId: string) => {
    setIsOpen(false);
    communityId && onCommunityCreated(communityId);
  };

  return (
    <SideMenuSection heading={<FormattedMessage id="SideSectionMyCommunity.myCommunity" />}>
      {socialCommunityCreationButtonVisible && (
        <SideMenuActionItem
          data-qa-anchor="side-section-my-community-create-community-button"
          icon={<Plus height="20px" />}
          element="button"
          onClick={open}
        >
          <FormattedMessage id="createCommunity" />
        </SideMenuActionItem>
      )}

      <CommunitiesList
        className={className}
        communitiesQueryParam={{ membership: 'member', limit: 20 }}
        activeCommunity={activeCommunity}
      />

      <CommunityCreationModal isOpen={isOpen} onClose={close} />
    </SideMenuSection>
  );
};

export default memo(SideSectionMyCommunity);
