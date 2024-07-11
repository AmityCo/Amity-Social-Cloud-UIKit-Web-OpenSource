import React, { useEffect, useRef, useState } from 'react';
import { StoryTab } from '~/v4/social/components/StoryTab';
import { EmptyNewsfeed } from '~/v4/social/components/EmptyNewsFeed';
import { GlobalFeed } from '~/v4/social/components/GlobalFeed';

import styles from './Newsfeed.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useGlobalFeedContext } from '../../providers/GlobalFeedProvider';

const Spinner = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <div className={styles.newsfeed__pullToRefresh__spinner}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.1122 5C11.1122 5.39449 10.7924 5.71429 10.3979 5.71429C10.0035 5.71429 9.68366 5.39449 9.68366 5V0.714286C9.68366 0.319797 10.0035 0 10.3979 0C10.7924 0 11.1122 0.319797 11.1122 0.714286V5ZM8.25509 6.28846C8.59673 6.09122 8.71378 5.65437 8.51654 5.31273L6.37368 1.60119C6.17644 1.25955 5.73959 1.1425 5.39795 1.33975C5.05631 1.53699 4.93926 1.97384 5.1365 2.31548L7.27936 6.02702C7.4766 6.36865 7.91346 6.48571 8.25509 6.28846ZM6.42496 6.88141C6.7666 7.07865 6.88366 7.51551 6.68641 7.85714C6.48917 8.19878 6.05232 8.31583 5.71068 8.11859L1.99914 5.97573C1.6575 5.77849 1.54045 5.34164 1.7377 5C1.93494 4.65836 2.37179 4.54131 2.71343 4.73855L6.42496 6.88141ZM6.11224 10C6.11224 9.60551 5.79244 9.28571 5.39795 9.28571H1.11223C0.717746 9.28571 0.397949 9.60551 0.397949 10C0.397949 10.3945 0.717746 10.7143 1.11224 10.7143H5.39795C5.79244 10.7143 6.11224 10.3945 6.11224 10ZM5.71068 11.8814C6.05232 11.6842 6.48917 11.8012 6.68641 12.1429C6.88366 12.4845 6.7666 12.9213 6.42497 13.1186L2.71343 15.2614C2.37179 15.4587 1.93494 15.3416 1.7377 15C1.54045 14.6584 1.6575 14.2215 1.99914 14.0243L5.71068 11.8814ZM8.25509 13.7115C7.91345 13.5143 7.4766 13.6313 7.27936 13.973L5.1365 17.6845C4.93926 18.0262 5.05631 18.463 5.39795 18.6603C5.73959 18.8575 6.17644 18.7404 6.37368 18.3988L8.51654 14.6873C8.71378 14.3456 8.59673 13.9088 8.25509 13.7115ZM10.3979 14.2857C10.0035 14.2857 9.68366 14.6055 9.68366 15V19.2857C9.68366 19.6802 10.0035 20 10.3979 20C10.7924 20 11.1122 19.6802 11.1122 19.2857V15C11.1122 14.6055 10.7924 14.2857 10.3979 14.2857ZM12.5408 6.28846C12.8824 6.48571 13.3193 6.36865 13.5165 6.02702L15.6594 2.31548C15.8566 1.97384 15.7396 1.53699 15.3979 1.33975C15.0563 1.1425 14.6195 1.25956 14.4222 1.60119L12.2794 5.31273C12.0821 5.65437 12.1992 6.09122 12.5408 6.28846ZM15.0852 8.11859C14.7436 8.31583 14.3067 8.19878 14.1095 7.85714C13.9122 7.51551 14.0293 7.07866 14.3709 6.88141L18.0825 4.73855C18.4241 4.54131 18.861 4.65836 19.0582 5C19.2554 5.34164 19.1384 5.77849 18.7968 5.97573L15.0852 8.11859ZM14.6837 10C14.6837 10.3945 15.0035 10.7143 15.3979 10.7143H19.6837C20.0782 10.7143 20.3979 10.3945 20.3979 10C20.3979 9.60551 20.0782 9.28571 19.6837 9.28571H15.3979C15.0035 9.28571 14.6837 9.60551 14.6837 10ZM14.3709 13.1186C14.0293 12.9213 13.9122 12.4845 14.1095 12.1429C14.3067 11.8012 14.7436 11.6842 15.0852 11.8814L18.7968 14.0243C19.1384 14.2215 19.2554 14.6584 19.0582 15C18.861 15.3416 18.4241 15.4587 18.0825 15.2614L14.3709 13.1186ZM12.5408 13.7115C12.1992 13.9088 12.0821 14.3456 12.2794 14.6873L14.4222 18.3988C14.6195 18.7404 15.0563 18.8575 15.3979 18.6603C15.7396 18.463 15.8566 18.0262 15.6594 17.6845L13.5165 13.973C13.3193 13.6313 12.8824 13.5143 12.5408 13.7115Z"
          fill="url(#paint0_angular_1709_10374)"
        />
        <defs>
          <radialGradient
            id="paint0_angular_1709_10374"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(10.3979 10) scale(10)"
          >
            <stop offset="0.669733" stopColor="#595F67" />
            <stop offset="0.716307" stopColor="#262626" stopOpacity="0.01" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

interface NewsfeedProps {
  pageId?: string;
}

export const Newsfeed = ({ pageId = '*' }: NewsfeedProps) => {
  const componentId = 'newsfeed';
  const { themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const touchStartY = useRef(0);
  const [touchDiff, setTouchDiff] = useState(0);

  const { itemWithAds, hasMore, isLoading, loadMore, fetch, refetch, removeItem } =
    useGlobalFeedContext();

  useEffect(() => {
    fetch();
  }, []);

  const onFeedReachBottom = () => {
    if (hasMore && !isLoading) loadMore();
  };

  if (itemWithAds.length === 0 && !isLoading) {
    return <EmptyNewsfeed pageId={pageId} />;
  }

  return (
    <div
      className={styles.newsfeed}
      style={themeStyles}
      onTouchStart={(ev) => {
        touchStartY.current = ev.touches[0].clientY;
      }}
      onTouchMove={(ev) => {
        const touchY = ev.touches[0].clientY;

        if (touchStartY.current > touchY) {
          return;
        }

        setTouchDiff(Math.min(touchY - touchStartY.current, 100));
        if (touchDiff > 0 && window.scrollY === 0) {
          ev.preventDefault();
        }
      }}
      onTouchEnd={() => {
        touchStartY.current = 0;
        if (touchDiff >= 75) {
          refetch();
        }
        setTouchDiff(0);
      }}
    >
      <div
        style={
          {
            '--asc-pull-to-refresh-height': `${touchDiff}px`,
          } as React.CSSProperties
        }
        className={styles.newsfeed__pullToRefresh}
      >
        <Spinner />
      </div>
      <div className={styles.newsfeed__divider} />
      <StoryTab type="globalFeed" pageId={pageId} />
      {itemWithAds.length > 0 && <div className={styles.newsfeed__divider} />}
      <GlobalFeed
        isLoading={isLoading}
        items={itemWithAds}
        pageId={pageId}
        componentId={componentId}
        onFeedReachBottom={() => onFeedReachBottom()}
        onPostDeleted={(post) => removeItem(post.postId)}
      />
    </div>
  );
};
