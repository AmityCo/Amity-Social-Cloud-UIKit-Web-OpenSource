import { useState, useEffect } from 'react';
import { PostRepository, LoadingStatus, PostTargetType } from '@amityco/js-sdk';

/**
 * Used in Storybook stories only to get a single post for the current user.
 * Will first try to use an existing post, then create a new one if none exist.
 */
const useOnePost = () => {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let newPostLiveObject = {};
    const postsLiveCollection = PostRepository.queryMyPosts();

    postsLiveCollection.once('loadingStatusChanged', ({ newValue }) => {
      if (newValue !== LoadingStatus.Loaded) return;
      if (postsLiveCollection.models.length) {
        setPost(postsLiveCollection.models[0]);
        setIsLoading(false);
      } else {
        newPostLiveObject = PostRepository.createTextPost({
          text: 'Post created for Story',
          targetType: PostTargetType.MyFeed,
        });

        newPostLiveObject.once('dataStatusChanged', () => {
          setPost(postsLiveCollection.model);
          setIsLoading(false);
        });
      }
    });

    return () => {
      postsLiveCollection.dispose();
      newPostLiveObject.dispose && newPostLiveObject.dispose();
    };
  }, []);

  return [post, isLoading];
};

export default useOnePost;
