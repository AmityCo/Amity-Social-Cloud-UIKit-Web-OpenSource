import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { Button } from '~/v4/core/components';
import styles from './LoadMoreWrapper.module.css';

interface LoadMoreWrapperProps {
  hasMore: boolean;
  loadMore: () => void;
  text?: string;
  contentSlot: React.JSX.Element[];
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
  appendIcon,
  isExpanded = true,
}: LoadMoreWrapperProps) => {
  const { formatMessage } = useIntl();
  const [expanded, setExpanded] = useState(isExpanded);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setExpanded(isExpanded);
  }, [isExpanded]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, loadMore]);

  if (expanded) {
    return (
      <div className={styles.content}>
        {contentSlot}
        <div ref={observerRef} />
      </div>
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
