import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { isAdmin, isModerator } from '~/helpers/permissions';
import useCommunity from '~/social/hooks/useCommunity';
import useCommunityPostPermission from '~/social/hooks/useCommunityPostPermission';
import { useNavigation } from '~/social/providers/NavigationProvider';

export const usePostHeaderProps = ({
  post,
  avatarFileUrl,
  loading,
  hidePostTarget,
}: {
  post?: Amity.Post;
  avatarFileUrl?: string;
  user?: Amity.User | null;
  loading?: boolean;
  hidePostTarget?: boolean;
}) => {
  const { onClickCommunity, onClickUser } = useNavigation();
  const { formatMessage } = useIntl();
  const { user, refresh } = useUser({ userId: post?.postedUserId });

  const community = useCommunity(post?.targetId);
  const { isModerator: isCommunityModerator } = useCommunityPostPermission({
    community,
    post,
  });

  useEffect(() => {
    refresh();
  }, []);

  const isCommunityPost = post?.targetType === 'community';
  const postTargetName = isCommunityPost ? community?.displayName : null;
  const handleClickCommunity = isCommunityPost
    ? () => post && onClickCommunity(post?.targetId)
    : null;

  const handleClickUser = () => post && onClickUser(post.postedUserId);

  return {
    avatarFileUrl: avatarFileUrl,
    postAuthorName: user?.displayName || formatMessage({ id: 'anonymous' }),
    postTargetName: postTargetName,
    timeAgo: post?.createdAt ? new Date(post?.createdAt) : undefined,
    isModerator: isCommunityModerator || isModerator(user?.roles) || isAdmin(user?.roles),
    isEdited:
      post?.createdAt && post?.editedAt
        ? new Date(post?.createdAt).getTime() < new Date(post?.editedAt).getTime()
        : false,
    isBanned: user?.isGlobalBanned,
    hidePostTarget: hidePostTarget,
    loading: loading,
    onClickCommunity: handleClickCommunity,
    onClickUser: handleClickUser,
  };
};
