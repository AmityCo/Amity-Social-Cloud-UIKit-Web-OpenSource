import React, { memo } from 'react';

import usePost from '~/social/hooks/usePost';
import usePoll from '~/social/hooks/usePoll';
import DefaultPostRenderer from './DefaultPostRenderer';

import { PollRepository, PostRepository, SubscriptionLevels } from '@amityco/ts-sdk';

import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import useImage from '~/core/hooks/useImage';
import usePostFlaggedByMe from '~/social/hooks/usePostFlaggedByMe';
import { usePostRenderer } from '~/social/providers/PostRendererProvider';
import usePostSubscription from '~/social/hooks/usePostSubscription';
import useReactionSubscription from '~/social/hooks/useReactionSubscription';

interface PostProps {
  postId: string;
  className?: string;
  hidePostTarget?: boolean;
  readonly?: boolean;
  onDeleted?: (postId: string) => void;
}

const Post = ({ postId, className, hidePostTarget, readonly, onDeleted }: PostProps) => {
  const post = usePost(postId);
  const avatarFileUrl = useImage({ fileId: post?.creator?.avatarFileId, imageSize: 'small' });

  const { isFlaggedByMe, flagPost, unflagPost } = usePostFlaggedByMe(post);

  const postRenderFn = usePostRenderer(post?.dataType);

  usePostSubscription({
    postId,
    level: SubscriptionLevels.POST,
  });

  useReactionSubscription({
    targetType: post?.targetType,
    targetId: post?.targetId,
    shouldSubscribe: () => !!post,
  });

  const pollPost = (post?.latestComments || []).find(
    (childPost: Amity.Post) => childPost.dataType === 'poll',
  );

  const poll = usePoll((pollPost?.data as Amity.ContentDataPoll)?.pollId);
  const isPollClosed = poll?.status === 'closed';

  const handleClosePoll = async () => {
    if (poll == null) return;
    await PollRepository.closePoll(poll.pollId);
  };

  const handleDeletePost = async () => {
    if (post == null) return;
    await PostRepository.deletePost(post.postId);
    onDeleted?.(post.postId);
  };

  const handleApprovePost = async () => {
    if (post == null) return;
    await PostRepository.approvePost(post.postId);
  };
  const handleDeclinePost = async () => {
    if (post == null) return;
    await PostRepository.declinePost(post.postId);
  };

  if (post == null || postRenderFn == null) {
    return <DefaultPostRenderer loading />;
  }

  return (
    <>
      {postRenderFn({
        childrenPosts: post?.latestComments || [],
        handleClosePoll,
        isPollClosed,
        avatarFileUrl,
        user: post?.creator,
        poll,
        className,
        currentUserId: post?.postedUserId || undefined,
        hidePostTarget,
        post,
        userRoles: post?.creator?.roles || [],
        readonly,
        isFlaggedByMe,
        handleReportPost: flagPost,
        handleUnreportPost: unflagPost,
        handleApprovePost,
        handleDeclinePost,
        handleDeletePost,
      })}
    </>
  );
};

export default memo((props: PostProps) => {
  const CustomComponentFn = useCustomComponent<PostProps>('Post');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <Post {...props} />;
});
