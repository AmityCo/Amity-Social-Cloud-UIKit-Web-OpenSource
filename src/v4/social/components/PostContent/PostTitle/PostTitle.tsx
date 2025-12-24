import React, { useMemo } from 'react';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { Typography } from '~/v4/core/components';
import AngleRight from '~/v4/icons/AngleRight';
import { Button } from '~/v4/core/natives/Button';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge';
import styles from './PostTitle.module.css';
import { BrandBadge } from '~/v4/social/elements';

interface PostTitleProps {
  post: Amity.Post;
  pageId?: string;
  componentId?: string;
  hideTarget?: boolean;
}
export const PostTitle = ({ pageId, componentId, post, hideTarget }: PostTitleProps) => {
  const shouldCallCommunity = useMemo(() => post?.targetType === 'community', [post?.targetType]);
  const shouldCallUser = useMemo(
    () => post?.targetType === 'user' && post?.postedUserId !== post?.targetId,
    [post?.targetType, post?.postedUserId, post?.targetId],
  );

  const { community: targetCommunity } = useCommunity({
    communityId: post?.targetId,
    shouldCall: shouldCallCommunity,
  });

  const { user: targetUser } = useUser({
    userId: post?.targetId,
    shouldCall: shouldCallUser,
  });

  const { goToCommunityProfilePage, onClickUser } = useNavigation();

  const showTargetCommunity = targetCommunity && !hideTarget;
  const showTargetUser = targetUser && !hideTarget;
  const showBrandBadge = post?.creator?.isBrand;
  const showPrivateBadge = targetCommunity?.isPublic === false;
  const showOfficialBadge = targetCommunity?.isOfficial === true;

  const showTarget = showTargetCommunity || showTargetUser;

  return (
    <div className={styles.postTitle} data-show-target-community={showTargetCommunity === true}>
      {post && post?.creator && (
        <div
          className={styles.postTitle__user__container}
          data-show-brand-badge={showBrandBadge === true}
          data-show-target={showTarget === true}
        >
          <Button
            onPress={() => post?.creator?.userId && onClickUser(post.creator.userId)}
            data-testid={`${pageId}/${componentId}/username`}
          >
            <Typography.BodyBold className={styles.postTitle__text}>
              {post.creator.displayName}
            </Typography.BodyBold>
          </Button>
          {showBrandBadge ? (
            <BrandBadge
              pageId={pageId}
              componentId={componentId}
              className={styles.postTitle__brandIcon}
            />
          ) : null}
          {showTarget ? (
            <AngleRight
              data-testid={`${pageId}/${componentId}/arrow_right`}
              className={styles.postTitle__icon}
            />
          ) : null}
        </div>
      )}
      {showTargetCommunity && (
        <div
          className={styles.postTitle__community}
          data-show-private-badge={showPrivateBadge === true}
          data-show-official-badge={showOfficialBadge === true}
        >
          {showPrivateBadge && <CommunityPrivateBadge />}
          <Button
            className={styles.postTitle__communityText}
            data-testid={`${pageId}/${componentId}/community_name`}
            onPress={() => goToCommunityProfilePage(targetCommunity.communityId)}
          >
            <Typography.BodyBold>{targetCommunity.displayName}</Typography.BodyBold>
          </Button>
          {showOfficialBadge && <CommunityOfficialBadge />}
        </div>
      )}
      {showTargetUser && (
        <div
          className={styles.postTitle__user__container}
          data-show-brand-badge={targetUser?.isBrand === true}
          data-show-target={false}
        >
          <Button onPress={() => onClickUser(targetUser.userId)}>
            <Typography.BodyBold className={styles.postTitle__text}>
              {targetUser.displayName}
            </Typography.BodyBold>
          </Button>
          {targetUser?.isBrand === true ? (
            <BrandBadge
              pageId={pageId}
              componentId={componentId}
              className={styles.postTitle__brandIcon}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};
