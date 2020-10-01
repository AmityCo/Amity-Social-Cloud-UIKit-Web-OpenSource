import React from 'react';

import { ConditionalRender } from '~/core/components/ConditionalRender';
import { LoadMoreButton, ShevronDownIcon } from './styles';

export const LoadMore = ({ hasMore, loadMore, children }) => {
  return (
    <div>
      {children}
      <ConditionalRender condition={hasMore}>
        <LoadMoreButton onClick={loadMore}>
          Load more <ShevronDownIcon />
        </LoadMoreButton>
      </ConditionalRender>
    </div>
  );
};
