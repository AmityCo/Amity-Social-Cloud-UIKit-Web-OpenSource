import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useCategory from '~/social/hooks/useCategory';
import PageHeader from '~/core/components/PageHeader';
import CategoryCommunitiesList from '~/social/components/community/CategoryCommunitiesList';
import { backgroundImage as CategoryImage } from '~/icons/Category';

const PageContainer = styled.div`
  & > *:first-child {
    margin-bottom: 1rem;
  }
`;

const CategoryCommunitiesPage = ({ categoryId, onBack, onClickCommunity }) => {
  const { category, file } = useCategory(categoryId);
  const title = category?.name || '';
  const { fileUrl } = file;
  return (
    <PageContainer>
      <PageHeader
        title={title}
        avatarFileUrl={fileUrl}
        avatarImage={CategoryImage}
        onBack={onBack}
      />
      <CategoryCommunitiesList categoryId={categoryId} onClickCommunity={onClickCommunity} />
    </PageContainer>
  );
};

CategoryCommunitiesPage.propTypes = {
  categoryId: PropTypes.string.isRequired,
  onBack: PropTypes.func,
  onClickCommunity: PropTypes.func,
};

CategoryCommunitiesPage.defaultProps = {
  onBack: null,
  onClickCommunity: null,
};

export default CategoryCommunitiesPage;
