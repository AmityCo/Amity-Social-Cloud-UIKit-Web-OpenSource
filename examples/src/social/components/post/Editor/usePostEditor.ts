import { PostRepository } from '@amityco/ts-sdk';
import { useMemo, useState } from 'react';
import { parseMentionsMarkup, reconstructMentions } from '~/helpers/utils';
import usePostByIds from '~/social/hooks/usePostByIds';
import useSocialMention from '~/social/hooks/useSocialMention';
import { isFilePost, isImagePost, isVideoPost } from '~/v4/social/utils/postTypeChecker';

export const usePostEditor = ({ post, onSave }: { post: Amity.Post; onSave: () => void }) => {
  const initialChildrenPosts = usePostByIds(post?.children);
  const { text, markup, mentions, mentionees, metadata, clearAll, onChange, queryMentionees } =
    useSocialMention({
      targetId: post?.targetId,
      targetType: post?.targetType,
      remoteText:
        typeof post?.data === 'string' ? post?.data : (post?.data as Amity.ContentDataText)?.text,
      remoteMarkup: parseMentionsMarkup(
        typeof post?.data === 'string' ? post?.data : (post?.data as Amity.ContentDataText)?.text,
        post?.metadata,
      ),
      remoteMentions: reconstructMentions(post?.metadata, post?.mentionees),
    });

  // List of the children posts removed - these will be deleted on save.
  const [localRemovedChildren, setLocalRemovedChildren] = useState<string[]>([]);

  const childrenPosts = useMemo(() => {
    return initialChildrenPosts.filter(
      (childPost) => !localRemovedChildren.includes(childPost.postId),
    );
  }, [initialChildrenPosts, localRemovedChildren]);

  const handleRemoveChild = (childPostId: string) => {
    setLocalRemovedChildren((prevRemovedChildren) => [...prevRemovedChildren, childPostId]);
  };

  const formattedAttachment = (post: Amity.Post) => {
    if (isImagePost(post) || isFilePost(post)) {
      return {
        type: post.dataType as 'file' | 'image',
        fileId: post.data?.fileId as string,
      };
    }
    if (isVideoPost(post)) {
      return {
        type: post.dataType as 'video',
        fileId: post.data?.videoFileId.original as string,
      };
    }
  };

  const handleSave = async () => {
    await PostRepository.editPost(post.postId, {
      data: { text },
      mentionees,
      metadata,
      attachments: childrenPosts
        .map(formattedAttachment)
        .filter((value): value is NonNullable<typeof value> => value != null),
    });
    clearAll();
    onSave();
  };

  const isEmpty = text?.trim() === '' && !childrenPosts.length;

  const childFilePosts = useMemo(
    () => childrenPosts.filter((childPost) => childPost.dataType === 'file'),
    [childrenPosts],
  );

  const childImagePosts = useMemo(
    () => childrenPosts.filter((childPost) => childPost.dataType === 'image'),
    [childrenPosts],
  );

  const childVideoPosts = useMemo(
    () => childrenPosts.filter((childPost) => childPost.dataType === 'video'),
    [childrenPosts],
  );

  return {
    text,
    markup,
    mentions,
    post,
    childrenPosts,
    clearAll,
    onChange,
    queryMentionees,
    childVideoPosts,
    childFilePosts,
    childImagePosts,
    handleRemoveChild,
    isEmpty,
    handleSave,
  };
};
