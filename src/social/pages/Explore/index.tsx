import React from 'react';
import { Container, Loader } from '@noom/wax-component-library';

import useCategories from '~/social/hooks/useCategories';
import RecommendedList, {
  RecommendedListSkeleton,
} from '~/social/components/community/RecommendedList';

import { PageContainer } from './styles';

const NUMBER_OF_COMMUNITIES_PER_CATEGORY = 5;

type Category = {
  categoryId: string;
  name: string;
  metadata: {
    description?: string;
  };
};

const List = ({
  categories = [],
  isLoading = false,
}: {
  categories: Category[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <>
        {new Array(3).fill(1).map((_v, index) => (
          <RecommendedListSkeleton key={index} />
        ))}
      </>
    );
  }

  return (
    <>
      {categories?.map((category) => (
        <RecommendedList
          category={category}
          key={category.categoryId}
          communityLimit={NUMBER_OF_COMMUNITIES_PER_CATEGORY}
        />
      ))}
    </>
  );
};

const ExplorePage = () => {
  const [categories = [], , , loading] = useCategories({
    isDeleted: false,
  }) as [Array<Category>, boolean, () => void, boolean, boolean];

  return (
    <PageContainer>
      <List categories={categories} isLoading={loading} />
    </PageContainer>
  );
};

export default ExplorePage;
