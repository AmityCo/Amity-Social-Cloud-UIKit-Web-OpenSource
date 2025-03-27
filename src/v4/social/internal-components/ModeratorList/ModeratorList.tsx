import React, { useEffect, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { CommunityMemberItem } from '~/v4/social/internal-components/CommunityMemberItem';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { UserListSkeleton } from '~/v4/social/internal-components/MemberList/MemberList';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import styles from './ModeratorList.module.css';

type ModeratorListProps = {
  pageId?: string;
  community: Amity.Community;
};

export const ModeratorList = ({ pageId = '*', community }: ModeratorListProps) => {
  const componentId = 'moderator_list';

  const { currentUserId } = useSDK();
  const { onClickUser } = useNavigation();
  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const { moderators, hasMore, isLoading, loadMore, refresh } = useCommunityModeratorsCollection({
    communityId: community?.communityId as string,
    shouldCall: !!community?.communityId,
  });

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => {
      if (hasMore && !isLoading) loadMore();
    },
  });

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.moderatorList}
      data-hidden={moderators.length <= 0}
    >
      {!isLoading &&
        moderators.length > 0 &&
        moderators.map(({ user, roles }) => (
          <CommunityMemberItem
            user={user}
            roles={roles}
            isModeratorTab
            pageId={pageId}
            community={community}
            currentUserId={currentUserId}
            onClick={() => onClickUser(user?.userId as string)}
          />
        ))}
      {isLoading && Array.from({ length: 5 }).map((_, index) => <UserListSkeleton key={index} />)}
      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
};
