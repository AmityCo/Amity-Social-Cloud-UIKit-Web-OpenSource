import { PostRepository } from 'eko-sdk';

import usePostChildren from '~/social/hooks/usePostChildren';
import useLiveObject from '~/core/hooks/useLiveObject';
import useUser from '~/core/hooks/useUser';

const usePost = postId => {
  const post = useLiveObject(() => PostRepository.postForId(postId), [postId]);
  const { postedUserId, children = [] } = post;

  const { user, file } = useUser(postedUserId, [postedUserId]);

  const handleReportPost = () => PostRepository.flag(postId);
  const handleDeletePost = () => PostRepository.deletePost(postId);

  const childrenPosts = usePostChildren(children);

  return {
    post,
    user,
    file,
    handleReportPost,
    handleDeletePost,
    childrenPosts,
  };
};

export default usePost;
