import React from 'react';
import clsx from 'clsx';
import styles from './LiveRoomTarget.module.css';
import useLiveRoomPosts from '~/v4/social/hooks/collections/useLiveRoomPosts';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';

export interface LiveRoomTargetProps {
  className?: string;
  onLoadingChange?: (isLoading: boolean) => void;
  onLiveRoomsChange?: (liveRooms: Amity.Post[]) => void;
}

export function LiveRoomTarget({
  className,
  onLoadingChange,
  onLiveRoomsChange,
}: LiveRoomTargetProps) {
  const { posts, isLoading } = useLiveRoomPosts();
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
    <div className={clsx(styles.liveRoomTarget, className)}>
      <div className={styles.liveRoomTarget__rings}>
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
