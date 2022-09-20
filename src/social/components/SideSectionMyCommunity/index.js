import React, { memo, useState, useState } from 'react';
import PropTypes from 'prop-types';
import { CommunityFilter } from '@amityco/js-sdk';
import { FormattedMessage } from 'react-intl';
import { Box, Icon } from '@noom/wax-component-library';

import SideMenuActionItem from '~/core/components/SideMenuActionItem';
import { ListHeading } from '~/core/components/SideMenuSection';
import { Plus, CommunityNoom } from '~/icons';
import CommunitiesList from '~/social/components/CommunitiesList';
import CommunityCreationModal from '~/social/components/CommunityCreationModal';
import { useConfig } from '~/social/providers/ConfigProvider';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { useSDK } from '~/core/hooks/useSDK';

const myListQueryParam = { filter: CommunityFilter.Member };

const CommunityCount = ({ count = 0, ...styles }) => <Box {...styles}>{count}</Box>;

const SideSectionMyCommunity = ({ className, activeCommunity }) => {
  const { connected } = useSDK();
  const { socialCommunityCreationButtonVisible } = useConfig();
  const { onCommunityCreated } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [communityCount, setCommunityCount] = useState(0);

  const open = () => setIsOpen(true);

  const close = (communityId) => {
    setIsOpen(false);
    communityId && onCommunityCreated(communityId);
  };

  return (
    <Box bg="white" h="100%" pb={2} pt={1}>
      <ListHeading>
        <Icon h={8} w={8} ml={0}>
          <CommunityNoom />
        </Icon>
        <FormattedMessage id="SideSectionMyCommunity.myCommunity" />

        <CommunityCount ml="auto" count={communityCount} />
      </ListHeading>
      <Box h="calc(100% - 50px)" minH={0} overflow="auto">
        {socialCommunityCreationButtonVisible && (
          <SideMenuActionItem
            icon={<Plus height={20} />}
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
          onChange={({ count }) => setCommunityCount(count)}
        />
      </Box>

      <CommunityCreationModal isOpen={isOpen} onClose={close} />
    </Box>
  );
};

SideSectionMyCommunity.propTypes = {
  className: PropTypes.string,
  activeCommunity: PropTypes.string,
};

export default memo(SideSectionMyCommunity);
