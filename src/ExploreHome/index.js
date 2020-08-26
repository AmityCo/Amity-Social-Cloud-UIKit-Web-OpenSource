import React, { useState, useEffect } from 'react';

import { customizableComponent } from '../hoks/customization';
import Modal from '../commonComponents/Modal';
import Menu, { MenuItem } from '../commonComponents/Menu';
import CommunityName from '../commonComponents/CommunityName';

import { getCommunities, getCategories } from '../mock';

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

const ExploreHome = ({
  client,
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
          <MenuItem onClick={() => onCategoryClick(category.id)}>
            <Category>
              <Avatar avatar={category.avatar} /> {category.name}
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
                onClick={() => onRecomendedCommunityClick(community)}
                community={community}
              />
            ))}
          </CommunityItems>
        </Block>

        <Block>
          <BlockHeader>Today's Trending</BlockHeader>
          <TrendingCommunities>
            {communities.map(community => (
              <TrendingCommunity
                onClick={() => onTrendingCommunityClick(community)}
                community={community}
              />
            ))}
          </TrendingCommunities>
        </Block>

        <Block>
          <BlockHeader>Categories</BlockHeader>
          <Categories>
            {categories.map(category => (
              <Category onClick={() => onCategoryClick(category.id)}>
                <Avatar avatar={category.avatar} /> {category.name}
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

export default customizableComponent('ExploreHome')(ExploreHome);
