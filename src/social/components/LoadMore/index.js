import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { LoadMoreButton, ShevronDownIcon } from './styles';

const LoadMore = ({
  hasMore,
  loadMore,
  text = '',
  children,
  className = '',
  prependIcon = null,
  appendIcon = <ShevronDownIcon />,
  isExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  useEffect(() => setExpanded(isExpanded), [isExpanded]);

  if (expanded) {
    return (
      <div>
        {children}
        {hasMore && (
          <LoadMoreButton className={className} onClick={loadMore}>
            {prependIcon} {text || <FormattedMessage id="loadMore" />} {appendIcon}
          </LoadMoreButton>
        )}
      </div>
    );
  }

  return !!children.length ? (
    <div>
      <LoadMoreButton className={className} onClick={() => setExpanded(true)}>
        {prependIcon} {text || <FormattedMessage id="loadMore" />} {appendIcon}
      </LoadMoreButton>
    </div>
  ) : null;
};

export default LoadMore;
