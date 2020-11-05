import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import Card from '~/core/components/Card';
import PaginatedList from '~/core/components/PaginatedList';
import UiKitCategoryHeader from '~/social/components/category/Header';

import useCategories from '~/social/hooks/useCategories';

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > *, &:after {
    flex: 1 1 calc(100% / 3 - 1.5rem);
    min-width: 15rem;
  }

  &:after {
    display: block;
    content ' ';
    padding: 0.5em;
    margin-right: 0.5rem;
  }
`;

const CategoryHeader = styled(UiKitCategoryHeader)`
  margin-right: 1.5rem;
`;

const List = ({ onClick }) => {
  const Title = <FormattedMessage id="categoryList" />;

  const [categories, hasMore, loadMore] = useCategories({ isDeleted: false });

  return (
    <Card title={Title}>
      <PaginatedList items={categories} hasMore={hasMore} loadMore={loadMore} container={Grid}>
        {({ categoryId }) => (
          <CategoryHeader key={categoryId} categoryId={categoryId} onClick={onClick} />
        )}
      </PaginatedList>
    </Card>
  );
};

List.propTypes = {
  onClick: PropTypes.func,
};

export default List;
