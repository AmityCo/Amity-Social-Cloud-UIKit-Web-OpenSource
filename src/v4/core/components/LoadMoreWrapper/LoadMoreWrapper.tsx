import React, { useState, useEffect, ReactNode } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { Button } from '~/v4/core/components';
import styles from './LoadMoreWrapper.module.css';
import { ChevronDownIcon } from '~/v4/social/icons';

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

export const LoadMoreWrapper = ({
  hasMore,
  loadMore,
  text = '',
  contentSlot,
  className = '',
  prependIcon = null,
  appendIcon = <ChevronDownIcon />,
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
          <Button
            className={clsx(styles.loadMoreButton, className)}
            variant="secondary"
            onClick={loadMore}
          >
            {prependIcon}
            {text || formatMessage({ id: 'loadMore' })}
            {appendIcon}
          </Button>
        )}
      </>
    );
  }

  return !expanded ? (
    <>
      <Button className={clsx(styles.loadMoreButton, className)} onClick={() => setExpanded(true)}>
        {prependIcon}
        {text || formatMessage({ id: 'loadMore' })}
        {appendIcon}
      </Button>
    </>
  ) : null;
};
