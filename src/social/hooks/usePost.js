import { PostRepository } from 'eko-sdk';
import useMemoAsync from '~/core/hooks/useMemoAsync';

import usePostChildren from '~/social/hooks/usePostChildren';
import useLiveObject from '~/core/hooks/useLiveObject';
import useUser from '~/core/hooks/useUser';

const usePost = postId => {
  const post = useLiveObject(() => PostRepository.postForId(postId), [postId]);
  const { postedUserId, children = [] } = post;

  const { user, file } = useUser(postedUserId, [postedUserId]);

  const handleUpdatePost = data => PostRepository.updatePost({ postId, data });

  const handleReportPost = () => PostRepository.flag(postId);
  const handleUnreportPost = () => PostRepository.unflag(postId);
  const handleDeletePost = () => PostRepository.deletePost(postId);

  const childrenPosts = usePostChildren(children);

  const isFlaggedByMe = useMemoAsync(
    async () => (post?.postId ? PostRepository.isFlaggedByMe(post.postId) : false),
    [post],
  );

  return {
    post,
    user,
    file,
    handleUpdatePost,
    handleReportPost,
    handleUnreportPost,
    handleDeletePost,
    childrenPosts,
    isFlaggedByMe,
  };
};

export default usePost;
