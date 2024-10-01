import React, { useRef, useState } from 'react';
import { Avatar, Typography } from '~/v4/core/components';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useImage } from '~/v4/core/hooks/useImage';
import useSDK from '~/v4/core/hooks/useSDK';
import User from '~/v4/icons/User';
import { Button } from '~/v4/core/natives/Button';
import { CommentInput, CommentInputRef } from './CommentInput';
import { useMutation } from '@tanstack/react-query';
import { CommentRepository } from '@amityco/ts-sdk';
import Close from '~/v4/icons/Close';
import { Mentionees, Metadata } from '~/v4/helpers/utils';

import styles from './CommentComposer.module.css';

const LockSvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path
        fill="currentColor"
        d="M15.5 8c.813 0 1.5.688 1.5 1.5v7a1.5 1.5 0 01-1.5 1.5h-11A1.48 1.48 0 013 16.5v-7A1.5 1.5 0 014.5 8h1V6.5C5.5 4.031 7.5 2 10 2c2.5.031 4.5 2.063 4.5 4.563V8h1zM7 6.5V8h6V6.5c0-1.625-1.375-3-3-3-1.656 0-3 1.375-3 3zm8.5 10v-7h-11v7h11z"
      ></path>
    </svg>
  );
};

export type CreateCommentParams = {
  data: {
    text: string;
  };
  mentionees: Mentionees;
  metadata: Metadata;
};

interface CommentComposerProps {
  pageId?: string;
  referenceId: string;
  referenceType: Amity.CommentReferenceType;
  replyTo?: Amity.Comment;
  onCancelReply: () => void;
  shouldAllowCreation?: boolean;
  community?: Amity.Community | null;
}

export const CommentComposer = ({
  pageId = '*',
  referenceId,
  referenceType,
  replyTo,
  onCancelReply,
  shouldAllowCreation = true,
  community,
}: CommentComposerProps) => {
  const userId = useSDK().currentUserId;
  const { user } = useUser({ userId });
  const avatarUrl = useImage({ fileId: user?.avatar?.fileId, imageSize: 'small' });
  const editorRef = useRef<CommentInputRef | null>(null);
  const composerInputRef = useRef<HTMLDivElement | null>(null);
  const componentId = 'comment_composer_bar';
  const mentionContainerRef = useRef<HTMLDivElement | null>(null);

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

  const { mutateAsync } = useMutation({
    mutationFn: async ({ params }: { params: CreateCommentParams }) => {
      const parentId = replyTo ? replyTo.commentId : undefined;

      await CommentRepository.createComment({
        referenceId: replyTo ? replyTo.referenceId : referenceId,
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

  if (!shouldAllowCreation) {
    return (
      <div className={styles.commentComposer__disableContainer}>
        <LockSvg />
        <Typography.Body>Comments are disabled for this story</Typography.Body>
      </div>
    );
  }

  return (
    <div className={styles.commentComposer}>
      <div className={styles.commentComposer__top}>
        <div className={styles.commentComposer__mentionContainer} ref={mentionContainerRef} />
        {replyTo && (
          <div
            className={styles.commentComposer__replyContainer}
            style={
              {
                '--asc-reply-container-offset-bottom': `${composerHeight}px`,
              } as React.CSSProperties
            }
          >
            <div
              data-qa-anchor={`${pageId}/${componentId}/comment_composer_reply_text`}
              className={styles.commentComposer__replyContainer__text}
            >
              <span>Replying to </span>
              <span className={styles.commentComposer__replyContainer__username}>
                {replyTo?.userId}
              </span>
            </div>
            <Close
              onClick={onCancelReply}
              className={styles.commentComposer__replyContainer__closeButton}
            />
          </div>
        )}
      </div>
      <div className={styles.commentComposer__container}>
        <div className={styles.commentComposer__avatar}>
          <Avatar
            pageId={pageId}
            componentId={componentId}
            avatarUrl={avatarUrl}
            defaultImage={<User />}
          />
        </div>
        <div
          className={styles.commentComposer__input}
          ref={composerInputRef}
          data-qa-anchor={`${pageId}/${componentId}/comment_composer`}
        >
          <CommentInput
            ref={editorRef}
            mentionContainer={mentionContainerRef?.current}
            onChange={({ text, mentioned, mentionees }) => {
              setTextValue({
                data: {
                  text: text,
                },
                mentionees: mentionees,
                metadata: {
                  mentioned: mentioned,
                },
              });
            }}
            targetType={referenceType}
            targetId={referenceId}
            value={textValue}
            placehoder="Say something nice..."
            communityId={community?.communityId}
          />
        </div>
        <Button
          data-qa-anchor={`${pageId}/${componentId}/comment_composer_post`}
          isDisabled={!textValue?.data?.text}
          className={styles.commentComposer__button}
          onPress={() => mutateAsync({ params: textValue })}
        >
          <Typography.Body>Post</Typography.Body>
        </Button>
      </div>
    </div>
  );
};
