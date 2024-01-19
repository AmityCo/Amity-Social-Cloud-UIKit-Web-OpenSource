import { useIntl } from 'react-intl';
import useUser from '~/core/hooks/useUser';
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
  const user = useUser(post?.postedUserId);

  const community = useCommunity(post?.targetId);
  const { isModerator: isCommunityModerator } = useCommunityPostPermission({
    community,
    post,
    userId: post?.postedUserId,
  });

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
    timeAgo: new Date(post?.createdAt),
    isModerator: isCommunityModerator || isModerator(user?.roles) || isAdmin(user?.roles),
    isEdited: new Date(post?.createdAt).getTime() < new Date(post?.editedAt).getTime(),
    isBanned: user?.isGlobalBanned,
    hidePostTarget: hidePostTarget,
    loading: loading,
    onClickCommunity: handleClickCommunity,
    onClickUser: handleClickUser,
  };
};
