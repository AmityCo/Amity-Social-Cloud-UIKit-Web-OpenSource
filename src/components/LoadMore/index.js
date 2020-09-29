import React from 'react';

import { LoadMoreButton, ShevronDownIcon } from './styles';

export const LoadMore = ({ hasMore, loadMore, children }) => {
  return (
    <div>
      {children}
      {hasMore && (
        <LoadMoreButton onClick={loadMore}>
          Load more <ShevronDownIcon />
        </LoadMoreButton>
      )}
    </div>
  );
};
