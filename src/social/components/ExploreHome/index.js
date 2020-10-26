import React, { useState } from 'react';

import Modal from '~/core/components/Modal';
import { MenuItem } from '~/core/components/Menu';
import customizableComponent from '~/core/hocs/customization';
import { getCommunities, getCategories } from '~/mock';
import { backgroundImage as CategoryImage } from '~/icons/Category';

import Community from './Community';
import TrendingCommunity from './TrendingCommunity';
import ExploreHeader from './ExploreHeader';

import {
  Avatar,
  ExploreHomeContainer,
  Blocks,
  Block,
  BlockHeader,
  CommunityItems,
  Categories,
  Category,
  TrendingCommunities,
  ViewAllButton,
  RightIcon,
  CategoryModalBody,
} from './styles';

const MAX_CATEGORY_DISPLAY = 15;

const ExploreHome = ({
  onSearchResultCommunityClick,
  onRecomendedCommunityClick,
  onTrendingCommunityClick,
  onCreateCommunityClick,
  onCategoryClick,
}) => {
  const communities = getCommunities();

  const categories = getCategories();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const openCategoryModal = () => setShowCategoryModal(true);
  const closeCategoryModal = () => setShowCategoryModal(false);

  const modal = showCategoryModal ? (
    <Modal title="Category" onCancel={closeCategoryModal}>
      <CategoryModalBody>
        {categories.map(category => (
          <MenuItem key={category.id} onClick={() => onCategoryClick(category.id)}>
            <Category>
              <Avatar key={category.id} avatar={category.avatar} backgroundImage={CategoryImage} />
              {` ${category.name}`}
            </Category>
          </MenuItem>
        ))}
      </CategoryModalBody>
    </Modal>
  ) : null;

  return (
    <ExploreHomeContainer>
      <ExploreHeader
        onSearchResultCommunityClick={onSearchResultCommunityClick}
        onCreateCommunityClick={onCreateCommunityClick}
      />
      <Blocks>
        <Block>
          <BlockHeader>Recommended for you</BlockHeader>
          <CommunityItems>
            {communities.slice(0, 5).map(community => (
              <Community
                key={community.communityId}
                onClick={() => onRecomendedCommunityClick(community)}
                community={community}
              />
            ))}
          </CommunityItems>
        </Block>

        <Block>
          <BlockHeader>Today&apos;s Trending</BlockHeader>
          <TrendingCommunities>
            {communities.slice(0, 6).map(community => (
              <TrendingCommunity
                key={community.communityId}
                onClick={() => onTrendingCommunityClick(community)}
                community={community}
              />
            ))}
          </TrendingCommunities>
        </Block>

        <Block>
          <BlockHeader>Categories</BlockHeader>
          <Categories>
            {categories.slice(0, MAX_CATEGORY_DISPLAY).map(category => (
              <Category key={category.id} onClick={() => onCategoryClick(category.id)}>
                <Avatar avatar={category.avatar} backgroundImage={CategoryImage} />
                {`${category.name}`}
              </Category>
            ))}
          </Categories>
          <ViewAllButton onClick={openCategoryModal}>
            View all
            <RightIcon />
          </ViewAllButton>
        </Block>
      </Blocks>
      {modal}
    </ExploreHomeContainer>
  );
};

export default customizableComponent('ExploreHome', ExploreHome);
