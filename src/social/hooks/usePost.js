import { PostRepository } from 'eko-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';
import useUser from '~/core/hooks/useUser';

const usePost = postId => {
  const post = useLiveObject(() => PostRepository.postForId(postId), [postId]);
  const { postedUserId } = post;

  const { user, file } = useUser(postedUserId, [postedUserId]);

  const handleReportPost = () => PostRepository.flag(postId);
  const handleDeletePost = () => PostRepository.deletePost(postId);

  return {
    post,
    user,
    file,
    handleReportPost,
    handleDeletePost,
  };
};

export default usePost;
