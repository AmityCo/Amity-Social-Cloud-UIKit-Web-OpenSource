import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button } from '~/v4/core/components/index';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useImage } from '~/v4/core/hooks/useImage';
import useSDK from '~/v4/core/hooks/useSDK';
import User from '~/v4/icons/User';
import { PostCommentInput, PostCommentInputRef } from './PostCommentInput';
import styles from './PostCommentComposer.module.css';
import { useMutation } from '@tanstack/react-query';
import { CommentRepository } from '@amityco/ts-sdk';
import Close from '~/v4/icons/Close';
import { Mentionees, Metadata } from '~/v4/helpers/utils';

export type CreateCommentParams = {
  data: {
    text: string;
  };
  mentionees: Mentionees;
  metadata: Metadata;
};

export const PostCommentComposer = ({
  post,
  replyTo,
  onCancelReply,
}: {
  post: Amity.Post;
  replyTo?: Amity.Comment;
  onCancelReply: () => void;
}) => {
  const userId = useSDK().currentUserId;
  const { user } = useUser(userId);
  const avatarUrl = useImage({ fileId: user?.avatar?.fileId, imageSize: 'small' });
  const editorRef = useRef<PostCommentInputRef | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);

  const [composerHeight, setComposerHeight] = useState(0);

  const [textValue, setTextValue] = useState<CreateCommentParams>({
    data: {
      text: '',
    },
    mentionees: [
      {
        type: 'user',
        userIds: [''],
      },
    ],
    metadata: {},
  });

  const onChange = (val: any) => {
    setTextValue(val);
  };

  const { mutateAsync } = useMutation({
    mutationFn: async ({ params }: { params: CreateCommentParams }) => {
      const referenceId = replyTo ? replyTo.referenceId : post.postId;
      const referenceType = replyTo ? replyTo.referenceType : 'post';
      const parentId = replyTo ? replyTo.commentId : undefined;

      await CommentRepository.createComment({
        referenceId,
        referenceType,
        parentId,
        ...params,
        mentionees: params.mentionees as Amity.UserMention[],
      });
    },
    onError: (error) => {},
    onSuccess: () => {
      setTextValue({
        data: { text: '' },
        mentionees: [],
        metadata: {},
      });
      editorRef.current?.clearEditorState();
      onCancelReply();
    },
  });

  useEffect(() => {
    if (composerRef.current) {
      setComposerHeight(composerRef.current.offsetHeight);
    }
  }, []);

  return (
    <div className={styles.postCommentComposer__container} ref={composerRef}>
      <div className={styles.postCommentComposer__avatar}>
        <Avatar avatarUrl={avatarUrl} defaultImage={<User />} />
      </div>
      <div className={styles.postCommentComposer__input}>
        <PostCommentInput
          ref={editorRef}
          onChange={onChange}
          postTargetType={post.targetType}
          postTargetId={post.targetId}
          mentionOffsetBottom={-composerHeight}
          value={textValue}
          placehoder="Say something nice..."
        />
      </div>
      <Button
        variant="ghost"
        disabled={!textValue.data.text}
        className={styles.postCommentComposer__button}
        onClick={() => mutateAsync({ params: textValue })}
      >
        Post
      </Button>
      {replyTo && (
        <div
          className={styles.postCommentComposer__replyContainer}
          style={{ bottom: composerHeight }}
        >
          <div className={styles.postCommentComposer__replyContainer__text}>
            <span>Replying to </span>
            <span className={styles.postCommentComposer__replyContainer__username}>
              {replyTo?.userId}
            </span>
          </div>
          <Close
            onClick={onCancelReply}
            className={styles.postCommentComposer__replyContainer__closeButton}
          />
        </div>
      )}
    </div>
  );
};
