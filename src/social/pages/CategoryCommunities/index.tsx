import React from 'react';

import { PageTypes } from '~/social/constants';
import useCategory from '~/social/hooks/useCategory';
import { useNavigation } from '~/social/providers/NavigationProvider';
import ArrowLeft from '~/icons/ArrowLeft';

import { BackButton, Header, PageContainer, Title } from './styles';
import UICategoryCommunitiesList from '~/social/components/community/CategoryCommunitiesList/UICategoryCommunitiesList';
import { useCategoryCommunitiesList } from '~/social/components/community/CategoryCommunitiesList/hook';

interface CategoryCommunitiesPageProps {
  categoryId?: string | null;
}

const CategoryCommunitiesPage = ({ categoryId }: CategoryCommunitiesPageProps) => {
  const { onChangePage } = useNavigation();
  const category = useCategory(categoryId);
  const { communities, loadMore, isLoading, hasMore, onClickCommunity } =
    useCategoryCommunitiesList({ categoryId });

  const title = category?.name || '';

  const onBack = () => onChangePage(PageTypes.Explore);

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={onBack}>
          <ArrowLeft />
        </BackButton>
        <Title>{title}</Title>
      </Header>
      {category ? (
        <UICategoryCommunitiesList
          category={category}
          communities={communities}
          loadMore={loadMore}
          isLoading={isLoading}
          hasMore={hasMore}
          onClickCommunity={onClickCommunity}
        />
      ) : null}
    </PageContainer>
  );
};

export default CategoryCommunitiesPage;
