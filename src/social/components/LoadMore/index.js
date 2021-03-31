import React, { useState, useEffect } from 'react';

import ConditionalRender from '~/core/components/ConditionalRender';
import { LoadMoreButton, ShevronDownIcon } from './styles';

// TODO: react-intl
const DEFAULT_TEXT = 'Load more';

const LoadMore = ({
  hasMore,
  loadMore,
  text,
  children,
  className = '',
  prependIcon,
  appendIcon = <ShevronDownIcon />,
  isExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  useEffect(() => setExpanded(isExpanded), [isExpanded]);
  return (
    <ConditionalRender condition={expanded}>
      <div>
        {children}
        {hasMore && (
          <LoadMoreButton onClick={loadMore} className={className}>
            {prependIcon} {text || DEFAULT_TEXT} {appendIcon}
          </LoadMoreButton>
        )}
      </div>
      {children.length && (
        <div>
          <LoadMoreButton onClick={() => setExpanded(true)} className={className}>
            {prependIcon} {text || DEFAULT_TEXT} {appendIcon}
          </LoadMoreButton>
        </div>
      )}
    </ConditionalRender>
  );
};

export default LoadMore;
