import React, { useRef, useState } from 'react';
import { Typography } from '~/v4/core/components';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import useSDK from '~/v4/core/hooks/useSDK';
import { Button } from '~/v4/core/components/AriaButton';
import { CommentInput, CommentInputRef } from './CommentInput';
import { useMutation } from '@tanstack/react-query';
import { CommentRepository } from '@amityco/ts-sdk';
import Close from '~/v4/icons/Close';
import { Mentionees, Metadata } from '~/v4/helpers/utils';

import clsx from 'clsx';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Notification } from '~/v4/core/components/Notification';
import { useNetworkState } from 'react-use';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { UserAvatar } from '~/v4/social/elements';
import styles from './CommentComposer.module.css';
import usePost from '~/v4/core/hooks/objects/usePost';

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
  containerClassName?: string;
  commentComposerClassName?: string;
}

export const CommentComposer = ({
  pageId = '*',
  referenceId,
  referenceType,
  replyTo,
  onCancelReply,
  shouldAllowCreation = true,
  community,
  containerClassName,
  commentComposerClassName,
}: CommentComposerProps) => {
  const userId = useSDK().currentUserId;
  const { user } = useUser({ userId });
  const { isDesktop } = useResponsive();
  const notification = useNotifications();
  const { online } = useNetworkState();
  const editorRef = useRef<CommentInputRef | null>(null);
  const composerInputRef = useRef<HTMLDivElement | null>(null);
  const componentId = 'comment_composer_bar';
  const mentionContainerRef = useRef<HTMLDivElement | null>(null);
  const { page } = useNavigation();

  const { post } = usePost(referenceId);

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

  const { mutateAsync, isPending } = useMutation({
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
    onError: (error) => {
      if (error.message.includes(ERROR_RESPONSE.CONTAIN_BLOCKED_WORD)) {
        notification.info({
          content: 'Your comment contains inappropriate word. Please review and delete it.',
        });
      } else if (error.message.includes(ERROR_RESPONSE.NOT_INCLUDE_WHITELIST_LINK)) {
        notification.info({
          content: 'Your comment contains a link that’s not allowed. Please review and delete it.',
        });
      } else if (error.message.includes(ERROR_RESPONSE.DELETED_POST) && post?.dataType === 'clip') {
        notification.info({
          content: 'This clip is no longer available.',
        });
      } else {
        notification.info({
          content: 'Oops, something went wrong',
        });
      }
    },
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
    <div
      className={clsx(styles.commentComposer, commentComposerClassName)}
      data-testid={`${pageId}/${componentId}/comment_composer`}
    >
      {!online && isPending && page.type == PageTypes.ViewStoryPage && (
        <Notification
          icon={<ExclamationCircle className={styles.commentComposer__notificationIcon} />}
          content={'Oops, something went wrong'}
          alignment="fixed"
          duration={3000}
        />
      )}
      <div className={styles.commentComposer__top}>
        <div className={styles.commentComposer__mentionContainer} ref={mentionContainerRef} />
        {replyTo && !isDesktop && (
          <div
            className={styles.commentComposer__replyContainer}
            style={
              {
                '--asc-reply-container-offset-bottom': `${composerHeight}px`,
              } as React.CSSProperties
            }
          >
            <div
              data-testid={`${pageId}/${componentId}/comment_composer_reply_text`}
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
      <div className={clsx(styles.commentComposer__container, containerClassName)}>
        <div className={styles.commentComposer__avatar}>
          <UserAvatar pageId={pageId} componentId={componentId} userId={userId} />
        </div>
        <div
          className={styles.commentComposer__input}
          ref={composerInputRef}
          data-testid={`${pageId}/${componentId}/comment_composer`}
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
            placehoder={
              replyTo ? `Replying to ${replyTo?.creator?.displayName}...` : 'Say something nice...'
            }
            communityId={community?.communityId}
          />
        </div>
        <Button
          variant="text"
          data-testid={`${pageId}/${componentId}/comment_composer_post`}
          isDisabled={!textValue?.data?.text || isPending}
          className={styles.commentComposer__button}
          onPressStart={() => {
            if (!online && page.type !== PageTypes.ViewStoryPage) {
              notification.info({
                content: 'Oops, something went wrong',
              });
              return;
            }
            mutateAsync({ params: textValue });
          }}
        >
          <Typography.Body>Post</Typography.Body>
        </Button>
      </div>
    </div>
  );
};
