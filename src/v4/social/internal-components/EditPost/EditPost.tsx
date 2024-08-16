import React, { useEffect, useRef, useState } from 'react';
import styles from './EditPost.module.css';
import { PostContentType, PostRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { LexicalEditor } from 'lexical';
import { useForm } from 'react-hook-form';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import {
  AmityPostComposerEditOptions,
  CreatePostParams,
} from '~/v4/social/pages/PostComposerPage/PostComposerPage';
import { PostTextField } from '~/v4/social/elements/PostTextField';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import { CloseButton } from '~/v4/social/elements/CloseButton/CloseButton';
import { Notification } from '~/v4/core/components/Notification';
import { EditPostButton } from '~/v4/social/elements/EditPostButton';
import { EditPostTitle } from '~/v4/social/elements/EditPostTitle';
import usePostByIds from '~/v4/core/hooks/usePostByIds';
import { ExclamationCircle } from '~/icons';
import { Thumbnail } from './Thumbnail';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import { arraysContainSameElements } from '~/v4/social/utils/arraysContainSameElements';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';

export function EditPost({ post }: AmityPostComposerEditOptions) {
  const pageId = 'post_composer_page';
  const { themeStyles } = useAmityPage({
    pageId,
  });

  const editorRef = useRef<LexicalEditor | null>(null);
  const { onBack } = useNavigation();
  const { confirm } = useConfirmContext();
  const { updateItem } = useGlobalFeedContext();

  const [textValue, setTextValue] = useState<CreatePostParams>({
    text: '',
    mentioned: [],
    mentionees: [
      {
        type: 'user',
        userIds: [''],
      },
    ],
    attachments: [
      {
        fileId: '',
        type: 'image',
      },
    ],
  });

  const [postImages, setPostImages] = useState<Amity.File[]>([]);
  const [postVideos, setPostVideos] = useState<Amity.File[]>([]);

  const [defaultPostImages, setDefaultPostImages] = useState<Amity.File[]>([]);
  const [defaultPostVideo, setDefaultPostVideo] = useState<Amity.File[]>([]);

  const mentionRef = useRef<HTMLDivElement | null>(null);

  const useMutateUpdatePost = () =>
    useMutation({
      mutationFn: async (params: Parameters<typeof PostRepository.editPost>[0]) => {
        return await PostRepository.editPost(post.postId, params);
      },
      onSuccess: (response) => {
        onBack();
        updateItem(response.data);
      },
      onError: (error) => {
        console.error('Failed to edit post', error);
      },
    });

  const { mutateAsync: mutateUpdatePostAsync, isPending, isError } = useMutateUpdatePost();

  const { handleSubmit } = useForm();
  const posts = usePostByIds(post?.children || []);

  useEffect(() => {
    const imagePosts = posts.filter((post) => post.dataType === 'image');
    setDefaultPostImages(imagePosts);
    setPostImages(imagePosts);
    const videoPosts = posts.filter((post) => post.dataType === 'video');
    setDefaultPostVideo(videoPosts);
    setPostVideos(videoPosts);
  }, [posts]);

  const handleRemoveThumbnailImage = (fieldId: string) => {
    setPostImages((prevImages) =>
      prevImages.filter((item: Amity.Post<'image'>) => item.data.fileId !== fieldId),
    );
  };

  const handleRemoveThumbnailVideo = (fieldId: string) => {
    setPostVideos((prevVideos) =>
      prevVideos.filter((item: Amity.Post<'video'>) => item.data.videoFileId.original !== fieldId),
    );
  };

  const onSave = () => {
    const attachmentsImage = postImages.map((item: Amity.Post<'image'>) => {
      return {
        fileId: item.data.fileId,
        type: PostContentType.IMAGE,
      };
    });

    const attachmentsVideo = postVideos.map((item: Amity.Post<'video'>) => {
      return { fileId: item.data.videoFileId.original, type: 'video' };
    });

    const attachments = [...attachmentsImage, ...attachmentsVideo];

    if (textValue) {
      mutateUpdatePostAsync({
        data: { text: textValue.text },
        metadata: { mentioned: textValue.mentioned ?? [] },
        mentionees: textValue.mentionees ?? [],
        attachments: attachments,
      });
    }
  };

  const onChange = (val: CreatePostParams) => {
    setTextValue(val);
  };

  const onClickClose = () => {
    confirm({
      pageId: pageId,
      type: 'confirm',
      title: 'Discard this post?',
      content: 'The post will be permanently deleted. It cannot be undone.',
      onOk: () => {
        onBack();
      },
      okText: 'Discard',
      cancelText: 'Keep editing',
    });
  };

  const isImageChanged = !arraysContainSameElements(defaultPostImages, postImages);
  const isVideoChanged = !arraysContainSameElements(defaultPostVideo, postVideos);

  return (
    <div className={styles.editPost} style={themeStyles}>
      <form onSubmit={handleSubmit(onSave)} className={styles.editPost__formMediaAttachment}>
        <div className={styles.editPost__topBar}>
          <CloseButton pageId={pageId} onPress={onClickClose} />
          <EditPostTitle pageId={pageId} />
          <EditPostButton
            pageId={pageId}
            type="submit"
            onPress={() => handleSubmit(onSave)}
            isDisabled={
              (post.data.text == textValue.text && !isImageChanged && !isVideoChanged) ||
              !(textValue.text.length > 0 || postImages.length > 0 || postVideos.length > 0)
            }
          />
        </div>
        <PostTextField
          ref={editorRef}
          onChange={onChange}
          mentionContainer={mentionRef.current}
          dataValue={{
            data: { text: post.data.text },
            metadata: {
              mentioned: post.metadata?.mentioned || [],
            },
            mentionees: post.mentionees,
          }}
        />

        <Thumbnail postMedia={postImages} onRemove={handleRemoveThumbnailImage} />
        <Thumbnail postMedia={postVideos} onRemove={handleRemoveThumbnailVideo} />

        <div ref={mentionRef} />
        <div className={styles.editPost__notiWrap}>
          {isPending && (
            <Notification
              content="Posting..."
              icon={<Spinner />}
              className={styles.editPost__status}
            />
          )}
          {isError && (
            <Notification
              content="Failed to edit post"
              icon={<ExclamationCircle className={styles.editPost_infoIcon} />}
              className={styles.editPost__status}
              duration={3000}
            />
          )}
        </div>
      </form>
    </div>
  );
}
