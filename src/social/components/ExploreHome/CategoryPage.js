import React from 'react';

import { customizableComponent } from '~/core/hocs/customization';

import { getCommunities, getCategory } from '~/mock';
import { backgroundImage as CategoryImage } from '~/icons/Category';

import Community from './Community';

import {
  Avatar,
  CategoryPageContainer,
  CategoryPageHeader,
  Blocks,
  Block,
  CommunityItems,
  CategoryName,
  BackButton,
  BackIcon,
} from './styles';

const CategoryPage = ({ onCommunityClick, onHeaderBackButtonClick, categoryId }) => {
  const communities = getCommunities();

  const category = getCategory(categoryId);

  return (
    <CategoryPageContainer>
      <Blocks>
        <CategoryPageHeader>
          <Avatar avatar={category.avatar} backgroundImage={CategoryImage} />
          <div>
            <BackButton onClick={onHeaderBackButtonClick}>
              <BackIcon />
              Back
            </BackButton>
            <CategoryName>{category.name}</CategoryName>
          </div>
        </CategoryPageHeader>
        <Block>
          <CommunityItems>
            {[...communities, ...communities, ...communities].map(community => (
              <Community
                key={community.communityId}
                onClick={() => onCommunityClick(community)}
                community={community}
              />
            ))}
          </CommunityItems>
        </Block>
      </Blocks>
    </CategoryPageContainer>
  );
};

export default customizableComponent('CategoryPage', CategoryPage);
