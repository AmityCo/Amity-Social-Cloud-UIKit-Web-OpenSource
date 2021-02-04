import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { EkoCommunityFilter } from 'eko-sdk';
import { FormattedMessage } from 'react-intl';

import SideMenuActionItem from '~/core/components/SideMenuActionItem';
import SideMenuSection from '~/core/components/SideMenuSection';
import { Plus } from '~/icons';
import CommunitiesList from '~/social/components/CommunitiesList';
import CommunityCreationModal from '~/social/components/CommunityCreationModal';
import { useNavigation } from '~/social/providers/NavigationProvider';

const myListQueryParam = { filter: EkoCommunityFilter.Member };

const SideSectionMyCommunity = ({ className, activeCommunity }) => {
  const { onCommunityCreated } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);

  const close = communityId => {
    setIsOpen(false);
    communityId && onCommunityCreated(communityId);
  };

  return (
    <SideMenuSection heading="My Community">
      <SideMenuActionItem icon={<Plus height="20px" />} onClick={open} element="button">
        <FormattedMessage id="createCommunity" />
      </SideMenuActionItem>

      <CommunitiesList
        className={className}
        communitiesQueryParam={myListQueryParam}
        activeCommunity={activeCommunity}
      />

      <CommunityCreationModal isOpen={isOpen} onClose={close} />
    </SideMenuSection>
  );
};

SideSectionMyCommunity.propTypes = {
  className: PropTypes.string,
  activeCommunity: PropTypes.string,
};

export default SideSectionMyCommunity;
