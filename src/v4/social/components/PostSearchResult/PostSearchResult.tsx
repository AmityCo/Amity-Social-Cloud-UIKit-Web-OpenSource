import React, { useState } from 'react';
import { EmptySearchResult } from '~/v4/social/internal-components/EmptySearchResult';
import {
  AmityPostCategory,
  AmityPostContentComponentStyle,
  PostContent,
} from '~/v4/social/components/PostContent/PostContent';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { PostContentSkeleton } from '~/v4/social/components/PostContent/PostContentSkeleton';
import { Divider } from '~/v4/social/elements/Divider';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import styles from './PostSearchResult.module.css';

type PostSearchResultProps = {
  pageId?: string;
  keyword: string;
  isLoading: boolean;
  onLoadMore: () => void;
  onClosePopover?: () => void;
  postCollection: Amity.Post[];
};

export const PostSearchResult = ({
  keyword,
  pageId = '*',
  isLoading,
  onLoadMore,
  onClosePopover,
  postCollection = [],
}: PostSearchResultProps) => {
  const componentId = 'post_search_result';

  const { themeStyles, accessibilityId } = useAmityComponent({ pageId, componentId });
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const { AmitySocialGlobalSearchPageBehavior } = usePageBehavior();

  // Filter posts based on keyword in data.text
  const filteredPosts = React.useMemo(() => {
    if (!keyword || keyword.trim() === '') {
      return postCollection;
    }

    return postCollection?.filter((post) => {
      // Check if post has text data and contains the keyword
      if (
        post.dataType === 'text' &&
        post.data &&
        typeof post.data === 'object' &&
        'text' in post.data
      ) {
        const postText = (post.data as { text: string }).text || '';
        return postText.toLowerCase().includes(keyword.toLowerCase());
      }
      return false;
    });
  }, [keyword, postCollection]);

  useIntersectionObserver({ onIntersect: () => onLoadMore(), node: intersectionNode });

  return (
    <div className={styles.postSearchResult} style={themeStyles} data-testid={accessibilityId}>
      <NoInternetConnectionHoc
        page="global-search"
        className={styles.postSearchResult__noInternetConnectionHoc}
      >
        {filteredPosts?.length > 0 &&
          filteredPosts.map((post, index) => {
            const isLastItem = index === filteredPosts.length - 1;
            return (
              <div
                key={post.postId}
                onClick={() => {
                  onClosePopover?.();
                  AmitySocialGlobalSearchPageBehavior?.goToPostDetailPage?.({
                    postId: post.postId,
                    keyword: keyword,
                  });
                }}
                className={styles.postSearchResult__postContentContainer}
              >
                <PostContent
                  pageId={pageId}
                  post={post as any}
                  category={AmityPostCategory.GENERAL}
                  style={AmityPostContentComponentStyle.FEED}
                  keyword={keyword}
                  isSearchPost
                  className={styles.postSearchResult__postContent}
                />
                <Divider className={styles.postSearchResult__divider} data-last-item={isLastItem} />
              </div>
            );
          })}
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={styles.postSearchResult__postContentSkeletonContainer}>
                <PostContentSkeleton />
                <Divider />
              </div>
            ))
          : null}
        {!isLoading && (filteredPosts?.length === 0 || !filteredPosts) && <EmptySearchResult />}
      </NoInternetConnectionHoc>

      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
};
