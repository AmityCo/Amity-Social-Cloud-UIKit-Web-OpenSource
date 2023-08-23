import React from 'react';
import PropTypes from 'prop-types';

import { PageTypes } from '~/social/constants';
import useCategory from '~/social/hooks/useCategory';
import CategoryCommunitiesList from '~/social/components/community/CategoryCommunitiesList';
import { useNavigation } from '~/social/providers/NavigationProvider';
import ArrowLeft from '~/icons/ArrowLeft';

import { BackButton, Header, PageContainer, Title } from './styles';

const CategoryCommunitiesPage = ({ categoryId }) => {
  const { onBack } = useNavigation();
  const { category } = useCategory(categoryId);

  const title = category?.name || '';

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={onBack}>
          <ArrowLeft height={14} />
        </BackButton>
        <Title>{title}</Title>
      </Header>
      <CategoryCommunitiesList categoryId={categoryId} />
    </PageContainer>
  );
};

CategoryCommunitiesPage.propTypes = {
  categoryId: PropTypes.string.isRequired,
};

export default CategoryCommunitiesPage;
