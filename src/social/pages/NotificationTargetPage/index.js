import Post from '~/social/components/post/Post';
import usePost from '~/social/hooks/usePost';

function NotificationTargetPage({ targetId }) {
  const { post } = usePost(targetId);

  return post.isDeleted ? (
    <h1 className="flex justify-center py-5 text-cym-placeholdergrey">
      This post has been deleted.
    </h1>
  ) : (
    <Post postId={targetId} />
  );
}

export default NotificationTargetPage;
