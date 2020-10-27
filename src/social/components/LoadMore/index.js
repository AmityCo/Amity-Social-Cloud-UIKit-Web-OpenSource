import React from 'react';

import ConditionalRender from '~/core/components/ConditionalRender';
import { LoadMoreButton, ShevronDownIcon } from './styles';

// TODO: react-intl
const DEFAULT_TEXT = 'Load more';

export const LoadMore = ({ hasMore, loadMore, text, children, className = '' }) => {
  return (
    <div>
      {children}
      <ConditionalRender condition={hasMore}>
        <LoadMoreButton onClick={loadMore} className={className}>
          {text || DEFAULT_TEXT} <ShevronDownIcon />
        </LoadMoreButton>
      </ConditionalRender>
    </div>
  );
};
