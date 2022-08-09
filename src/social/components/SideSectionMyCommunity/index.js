import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { CommunityFilter } from '@amityco/js-sdk';
import { FormattedMessage } from 'react-intl';

import SideMenuActionItem from '~/core/components/SideMenuActionItem';
import SideMenuSection from '~/core/components/SideMenuSection';
import { Plus } from '~/icons';
import CommunitiesList from '~/social/components/CommunitiesList';
import CommunityCreationModal from '~/social/components/CommunityCreationModal';
import { useConfig } from '~/social/providers/ConfigProvider';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { useSDK } from '~/core/hooks/useSDK';

const myListQueryParam = { filter: CommunityFilter.Member };

const SideSectionMyCommunity = ({ className, activeCommunity }) => {
  const { connected } = useSDK();
  const { socialCommunityCreationButtonVisible } = useConfig();
  const { onCommunityCreated } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);

  const close = (communityId) => {
    setIsOpen(false);
    communityId && onCommunityCreated(communityId);
  };

  return (
    <SideMenuSection heading={<FormattedMessage id="SideSectionMyCommunity.myCommunity" />}>
      {socialCommunityCreationButtonVisible && (
        <SideMenuActionItem
          icon={<Plus height="20px" />}
          element="button"
          disabled={!connected}
          onClick={open}
        >
          <FormattedMessage id="createCommunity" />
        </SideMenuActionItem>
      )}

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

export default memo(SideSectionMyCommunity);
