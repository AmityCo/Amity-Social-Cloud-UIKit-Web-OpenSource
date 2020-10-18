import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { EkoPostTargetType } from 'eko-sdk';

import FeedLayout from '~/social/components/FeedLayout';
import CommunitySideMenu from '~/social/components/CommunitySideMenu';
import Feed from '~/social/components/Feed';
import CommunityPage from '~/social/components/CommunityPage';
import CommunityCreationModal from '~/social/components/CommunityCreationModal';

const CommunityContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
`;

const CommunityV2 = ({
  shouldHideExplore,
  shouldHideTabs,
  showCreateCommunityButton,
  onMemberClick,
  blockRouteChange,
}) => {
  const [isShowingFeed, setIsShowingFeed] = useState(true);
  const [targetCommuntyId, setTargetCommuntyId] = useState(null);
  const [isCreatingCommunity, setIsCreatingCommunity] = useState(false);

  const handleClickNewsFeed = () => {
    setIsShowingFeed(true);
    setTargetCommuntyId(null);
  };

  const handleClickCommunity = communityId => {
    setTargetCommuntyId(communityId);
    setIsShowingFeed(false);
  };

  const getIsCommunityActive = communityId => communityId === targetCommuntyId;

  const openCommunityCreation = () => setIsCreatingCommunity(true);

  // TODO - need to get hold of new community Id.
  // New community creation (with SDK) need to call onClose with new community Id.
  const closeCommunityCreation = () => {
    setIsCreatingCommunity(false);
  };

  return (
    <CommunityContainer>
      <FeedLayout
        sideMenu={
          <CommunitySideMenu
            newsFeedActive={isShowingFeed}
            onClickNewsFeed={handleClickNewsFeed}
            onClickCommunity={handleClickCommunity}
            onClickCreateCommunity={openCommunityCreation}
            getIsCommunityActive={getIsCommunityActive}
            onSearchResultCommunityClick={handleClickCommunity}
            searchInputPlaceholder="Search"
            showCreateCommunityButton={showCreateCommunityButton}
            shouldHideExplore={shouldHideExplore}
          />
        }
      >
        {isShowingFeed ? (
          <Feed
            targetType={EkoPostTargetType.MyFeed}
            onPostAuthorClick={onMemberClick}
            blockRouteChange={blockRouteChange}
            showPostCompose
          />
        ) : (
          <CommunityPage
            communityId={targetCommuntyId}
            shouldHideTabs={shouldHideTabs}
            onMemberClick={onMemberClick}
          />
        )}
      </FeedLayout>
      <CommunityCreationModal isOpen={isCreatingCommunity} onClose={closeCommunityCreation} />
    </CommunityContainer>
  );
};

CommunityV2.propTypes = {
  shouldHideExplore: PropTypes.bool,
  shouldHideTabs: PropTypes.bool,
  showCreateCommunityButton: PropTypes.bool,
  onMemberClick: PropTypes.func,
  blockRouteChange: PropTypes.func,
};

const noop = () => {};

CommunityV2.defaultProps = {
  shouldHideExplore: false,
  shouldHideTabs: false,
  showCreateCommunityButton: true,
  onMemberClick: noop,
  blockRouteChange: noop,
};

export default CommunityV2;
