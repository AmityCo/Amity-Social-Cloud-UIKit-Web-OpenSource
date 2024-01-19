import React, { useState, useEffect, ReactNode } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { LoadMoreButton, ShevronDownIcon } from './styles';

interface LoadMoreWrapperProps {
  hasMore?: boolean;
  loadMore?: () => void;
  text?: string;
  contentSlot: ReactNode;
  className?: string;
  prependIcon?: ReactNode;
  appendIcon?: ReactNode;
  isExpanded?: boolean;
}

const LoadMoreWrapper = ({
  hasMore,
  loadMore,
  text = '',
  contentSlot,
  className = '',
  prependIcon = null,
  appendIcon = <ShevronDownIcon />,
  isExpanded = true,
}: LoadMoreWrapperProps) => {
  const { formatMessage } = useIntl();
  const [expanded, setExpanded] = useState(isExpanded);
  useEffect(() => setExpanded(isExpanded), [isExpanded]);

  if (expanded) {
    return (
      <>
        {contentSlot}
        {hasMore && (
          <LoadMoreButton className={className} onClick={loadMore}>
            {prependIcon} {text || formatMessage({ id: 'loadMore' })} {appendIcon}
          </LoadMoreButton>
        )}
      </>
    );
  }

  return !expanded ? (
    <>
      <LoadMoreButton className={className} onClick={() => setExpanded(true)}>
        {prependIcon} {text || formatMessage({ id: 'loadMore' })} {appendIcon}
      </LoadMoreButton>
    </>
  ) : null;
};

export default LoadMoreWrapper;
