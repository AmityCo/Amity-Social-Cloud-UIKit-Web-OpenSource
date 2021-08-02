import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import ConditionalRender from '~/core/components/ConditionalRender';
import { LoadMoreButton, ShevronDownIcon } from './styles';

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
            {prependIcon} {text || <FormattedMessage id="loadMore" />} {appendIcon}
          </LoadMoreButton>
        )}
      </div>
      {children.length && (
        <div>
          <LoadMoreButton onClick={() => setExpanded(true)} className={className}>
            {prependIcon} {text || <FormattedMessage id="loadMore" />} {appendIcon}
          </LoadMoreButton>
        </div>
      )}
    </ConditionalRender>
  );
};

export default LoadMore;
