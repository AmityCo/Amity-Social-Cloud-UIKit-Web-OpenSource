import React, {
  ComponentPropsWithRef,
  forwardRef,
  PropsWithChildren,
  Ref,
  useRef,
  useState,
} from 'react';
import { RefreshSpinner } from '~/v4/icons/RefreshSpinner';
import styles from './styles.module.css';

type PullToRefreshProps = ComponentPropsWithRef<'div'> &
  PropsWithChildren<{
    className?: string;
    accessibilityId?: string;
    style?: React.CSSProperties;
    onTouchEndCallback?: () => void;
    onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  }>;

export const PullToRefresh = forwardRef(function (
  { style, children, className, accessibilityId, onScroll, onTouchEndCallback }: PullToRefreshProps,
  ref: Ref<HTMLDivElement>,
) {
  const touchStartY = useRef(0);
  const [touchDiff, setTouchDiff] = useState(0);
  return (
    <div
      ref={ref}
      style={style}
      className={className}
      id={accessibilityId}
      data-testid={accessibilityId}
      onDrag={(event) => event.stopPropagation()}
      onTouchStart={(event) => {
        touchStartY.current = event.touches[0].clientY;
      }}
      onTouchMove={(event) => {
        const touchY = event.touches[0].clientY;
        if (touchStartY.current > touchY) return;
        setTouchDiff(Math.min(touchY - touchStartY.current, 100));
      }}
      onTouchEnd={() => {
        touchStartY.current = 0;
        if (touchDiff >= 75) onTouchEndCallback?.();
        setTouchDiff(0);
      }}
      onScroll={onScroll}
    >
      <div
        className={styles.pullToRefresh}
        style={{ '--asc-pull-to-refresh-height': `${touchDiff}px` } as React.CSSProperties}
      >
        <RefreshSpinner className={styles.pullToRefresh__spinner} />
      </div>
      {children}
    </div>
  );
});
