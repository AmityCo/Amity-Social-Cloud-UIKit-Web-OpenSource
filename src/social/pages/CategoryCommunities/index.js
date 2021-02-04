import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { PageTypes } from '~/social/constants';
import useCategory from '~/social/hooks/useCategory';
import PageHeader from '~/core/components/PageHeader';
import CategoryCommunitiesList from '~/social/components/community/CategoryCommunitiesList';
import { backgroundImage as CategoryImage } from '~/icons/Category';
import { useNavigation } from '~/social/providers/NavigationProvider';

const PageContainer = styled.div`
  & > *:first-child {
    margin-bottom: 1rem;
  }
  width: 100%;
`;

const CategoryCommunitiesPage = ({ categoryId }) => {
  const { onChangePage } = useNavigation();
  const { category, file } = useCategory(categoryId);

  const title = category?.name || '';
  const { fileUrl } = file;

  return (
    <PageContainer>
      <PageHeader
        title={title}
        avatarFileUrl={fileUrl}
        avatarImage={CategoryImage}
        onBack={() => onChangePage(PageTypes.Explore)}
      />
      <CategoryCommunitiesList categoryId={categoryId} />
    </PageContainer>
  );
};

CategoryCommunitiesPage.propTypes = {
  categoryId: PropTypes.string.isRequired,
};

export default CategoryCommunitiesPage;
