import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { EkoPostTargetType } from 'eko-sdk';

import ConditionalRender from '~/core/components/ConditionalRender';
import FeedLayout from '~/social/components/FeedLayout';
import ExplorePage from '~/social/components/ExplorePage';
import CommunitySideMenu from '~/social/components/CommunitySideMenu';
import Feed from '~/social/components/Feed';
import CategoryCommunitiesPage from '~/social/components/community/CategoryCommunitiesPage';
import CommunityProfilePage from '~/social/components/CommunityProfilePage';
import CommunityCreationModal from '~/social/components/CommunityCreationModal';

const ApplicationContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const PageTypes = {
  Explore: 'explore',
  NewsFeed: 'newsFeed',
  Community: 'community',
  Category: 'category',
};

const Community = ({
  showCreateCommunityButton,
  onMemberClick,
  onPostAuthorClick,
  onEditCommunityClick,
  blockRouteChange,
  onCommunityCreated,
}) => {
  const [currentPage, setCurrentPage] = useState(PageTypes.NewsFeed);
  const [targetCommuntyId, setTargetCommunityId] = useState(null);
  const [targetCategoryId, setTargetCategoryId] = useState(null);
  const [isCreatingCommunity, setIsCreatingCommunity] = useState(false);

  const pageTypeCondition = targetType => currentPage === targetType;

  // Handles navigating to NewsFeed and Explore pages.
  const handleClickPage = pageType => {
    setTargetCommunityId(null);
    setTargetCategoryId(null);
    setCurrentPage(pageType);
  };

  const handleClickCommunity = communityId => {
    setTargetCategoryId(null);
    setTargetCommunityId(communityId);
    setCurrentPage(PageTypes.Community);
  };

  const handleClickCategory = categoryId => {
    setTargetCommunityId(null);
    setTargetCategoryId(categoryId);
    setCurrentPage(PageTypes.Category);
  };

  const getIsCommunityActive = communityId => communityId === targetCommuntyId;

  const openCommunityCreation = () => setIsCreatingCommunity(true);

  const closeCommunityCreation = (newCommunityId = null) => {
    setIsCreatingCommunity(false);
    if (newCommunityId) {
      handleClickCommunity(newCommunityId);
    }
  };

  return (
    <ApplicationContainer>
      <FeedLayout
        sideMenu={
          <CommunitySideMenu
            newsFeedActive={pageTypeCondition(PageTypes.NewsFeed)}
            exploreActive={pageTypeCondition(PageTypes.Explore)}
            onClickNewsFeed={() => handleClickPage(PageTypes.NewsFeed)}
            onClickExplore={() => handleClickPage(PageTypes.Explore)}
            onClickCommunity={handleClickCommunity}
            onClickCreateCommunity={openCommunityCreation}
            getIsCommunityActive={getIsCommunityActive}
            onSearchResultCommunityClick={handleClickCommunity}
            searchInputPlaceholder="Search"
            showCreateCommunityButton={showCreateCommunityButton}
          />
        }
      >
        <ConditionalRender condition={pageTypeCondition(PageTypes.NewsFeed)}>
          <Feed
            targetType={EkoPostTargetType.GlobalFeed}
            onPostAuthorClick={onPostAuthorClick}
            blockRouteChange={blockRouteChange}
            showPostCreator
          />
        </ConditionalRender>
        <ConditionalRender condition={pageTypeCondition(PageTypes.Explore)}>
          <ExplorePage
            onClickCommunity={handleClickCommunity}
            onClickCategory={handleClickCategory}
            onCommunityCreated={onCommunityCreated}
          />
        </ConditionalRender>
        <ConditionalRender condition={pageTypeCondition(PageTypes.Community) && targetCommuntyId}>
          <CommunityProfilePage
            communityId={targetCommuntyId}
            onMemberClick={onMemberClick}
            onPostAuthorClick={onPostAuthorClick}
            onEditCommunityClick={onEditCommunityClick}
          />
        </ConditionalRender>
        <ConditionalRender condition={pageTypeCondition(PageTypes.Category) && targetCategoryId}>
          <CategoryCommunitiesPage
            categoryId={targetCategoryId}
            onBack={() => handleClickPage(PageTypes.Explore)}
            onClickCommunity={handleClickCommunity}
          />
        </ConditionalRender>
      </FeedLayout>
      <CommunityCreationModal isOpen={isCreatingCommunity} onClose={closeCommunityCreation} />
    </ApplicationContainer>
  );
};

Community.propTypes = {
  showCreateCommunityButton: PropTypes.bool,
  onMemberClick: PropTypes.func,
  onPostAuthorClick: PropTypes.func,
  blockRouteChange: PropTypes.func,
  onEditCommunityClick: PropTypes.func,
  onCommunityCreated: PropTypes.func,
};

const noop = () => {};

Community.defaultProps = {
  showCreateCommunityButton: true,
  onMemberClick: noop,
  blockRouteChange: noop,
  onPostAuthorClick: noop,
  onEditCommunityClick: noop,
  onCommunityCreated: noop,
};

export default Community;
