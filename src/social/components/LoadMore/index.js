import React from 'react';

import ConditionalRender from '~/core/components/ConditionalRender';
import { LoadMoreButton, ShevronDownIcon } from './styles';

export const LoadMore = ({ hasMore, loadMore, children, shouldHideBorder = false }) => {
  return (
    <>
      {children}
      <ConditionalRender condition={hasMore}>
        <LoadMoreButton onClick={loadMore} shouldHideBorder={shouldHideBorder}>
          Load more <ShevronDownIcon />
        </LoadMoreButton>
      </ConditionalRender>
    </>
  );
};
