import React from 'react';
import clsx from 'clsx';
import styles from './CommunityLiveRoomTarget.module.css';
import useCommunityLiveRoomPosts from '~/v4/social/hooks/collections/useCommunityLiveRoomPosts';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';

export interface CommunityLiveRoomTargetProps {
  communityId: string;
  className?: string;
  onLoadingChange?: (isLoading: boolean) => void;
  onLiveRoomsChange?: (liveRooms: Amity.Post[]) => void;
}

export function CommunityLiveRoomTarget({
  communityId,
  className,
  onLoadingChange,
  onLiveRoomsChange,
}: CommunityLiveRoomTargetProps) {
  const { posts, isLoading } = useCommunityLiveRoomPosts({ communityIds: [communityId] });
  const { goToLiveStreamPlayerPage, goToPostDetailPage } = useNavigation();

  React.useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading]);

  React.useEffect(() => {
    onLiveRoomsChange?.(posts || []);
  }, [posts]);

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className={clsx(styles.communityLiveRoomTarget, className)}>
      <div className={styles.communityLiveRoomTarget__rings}>
        {posts.map((post) => (
          <div
            key={post.postId}
            onClick={() =>
              goToLiveStreamPlayerPage?.({
                post,
                goToDetailPage: () =>
                  goToPostDetailPage({
                    postId: post?.postId,
                  }),
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
