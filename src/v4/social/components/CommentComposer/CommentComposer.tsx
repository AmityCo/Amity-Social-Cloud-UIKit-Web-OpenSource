import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { EVENT_LISTENER } from '~/v4/social/constants/eventListener';

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
  links?: Amity.Link[];
};

interface CommentComposerProps {
  pageId?: string;
  referenceId: string;
  referenceType: Amity.CommentReferenceType;
  replyTo?: Amity.Comment;
  parentIdOverride?: string;
  onCancelReply: () => void;
  shouldAllowCreation?: boolean;
  community?: Amity.Community | null;
  containerClassName?: string;
  commentComposerClassName?: string;
  isFromCommentClick?: boolean;
  externalError?: string | null;
}

export const CommentComposer = ({
  pageId = '*',
  referenceId,
  referenceType,
  replyTo,
  parentIdOverride,
  onCancelReply,
  shouldAllowCreation = true,
  community,
  containerClassName,
  commentComposerClassName,
  isFromCommentClick = false,
  externalError,
}: CommentComposerProps) => {
  const userId = useSDK().currentUserId;
  const isStoryPage = pageId === 'story_page';

  // Pre-fill the editor with an @mention of the reply target only when replying to a nested
  // comment (i.e. one that already has a parentId). Replies to top-level (L0) comments do not
  // pre-fill a mention; self-replies are also excluded.
  const shouldPreFillMention =
    replyTo !== undefined && replyTo.userId !== userId && !!replyTo.parentId;
  const mentionDisplayName = shouldPreFillMention ? replyTo?.creator?.displayName ?? null : null;

  const initialCommentValue = useMemo<CreateCommentParams | undefined>(() => {
    if (!mentionDisplayName || !replyTo) return undefined;
    const text = `@${mentionDisplayName} `;
    return {
      data: { text },
      metadata: {
        mentioned: [
          {
            index: 0,
            length: mentionDisplayName.length,
            displayName: mentionDisplayName,
            userId: replyTo.userId || '',
            type: 'user',
          },
        ],
      },
      mentionees: [{ type: 'user' as const, userIds: [replyTo.userId || ''] }],
      links: [],
    };
  }, [replyTo?.commentId, mentionDisplayName, replyTo?.userId]);
  const { isDesktop } = useResponsive();
  const notification = useNotifications();
  const { online } = useNetworkState();
  const editorRef = useRef<CommentInputRef | null>(null);
  const composerInputRef = useRef<HTMLDivElement | null>(null);
  const componentId = 'comment_composer_bar';
  const mentionContainerRef = useRef<HTMLDivElement | null>(null);
  const { page } = useNavigation();

  const { post } = usePost(referenceId);

  const [editorKey, setEditorKey] = useState('no-reply');
  const [inlineError, setInlineError] = useState<string | null>(null);
  const inlineErrorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showInlineError = (message: string) => {
    if (inlineErrorTimerRef.current) clearTimeout(inlineErrorTimerRef.current);
    setInlineError(message);
    inlineErrorTimerRef.current = setTimeout(() => setInlineError(null), 3000);
  };

  useEffect(() => {
    if (externalError && !isDesktop) {
      showInlineError(externalError);
    }
  }, [externalError]);

  useEffect(() => {
    if (replyTo) {
      setEditorKey(replyTo.commentId);
      if (initialCommentValue) {
        setTextValue(initialCommentValue);
      }
    }
  }, [replyTo?.commentId]);

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
    links: [],
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ params }: { params: CreateCommentParams }) => {
      // For L1 reply: parentIdOverride is undefined → use replyTo.commentId (the L1 id)
      // For L2 reply: parentIdOverride = L1 ancestor id → use it so the new comment is always L2
      const parentId = replyTo ? parentIdOverride ?? replyTo.commentId : undefined;

      const created = await CommentRepository.createComment({
        referenceId: replyTo ? replyTo.referenceId : referenceId,
        referenceType,
        parentId,
        data: params.data,
        metadata: params.metadata,
        mentionees: params.mentionees as Amity.UserMention[],
        links: params.links || [],
      });
      return { created, parentId };
    },
    onError: (error) => {
      let message = 'Oops, something went wrong';
      if (error.message.includes(ERROR_RESPONSE.BLOCKED_WORD)) {
        message = 'Your comment contains inappropriate word. Please review and delete it.';
      } else if (error.message.includes(ERROR_RESPONSE.BLOCKED_URL)) {
        message =
          'Your comment contains a link that\u2019s not allowed. Please review and delete it.';
      } else if (error.message.includes(ERROR_RESPONSE.DELETED_POST) && post?.dataType === 'clip') {
        message = 'This clip is no longer available.';
      } else if (error.message.includes(ERROR_RESPONSE.DELETED_COMMENT)) {
        const isL0Comment = replyTo && !replyTo.parentId;
        message = isL0Comment
          ? 'This comment is no longer available.'
          : 'This reply is no longer available.';
      }

      if (!isDesktop) {
        showInlineError(message);
      } else {
        notification.info({ content: message });
      }
    },
    onSuccess: (data) => {
      // Notify ReplyCommentList so it can prepend the new comment optimistically
      // before the live collection catches up.
      if (data?.parentId && data?.created) {
        document.dispatchEvent(
          new CustomEvent(EVENT_LISTENER.REPLY_CREATED, {
            detail: { parentId: data.parentId, comment: data.created.data as Amity.Comment },
          }),
        );
      } else if (!data?.parentId && data?.created) {
        // Notify CommentList so it can prepend the new L0 comment optimistically.
        document.dispatchEvent(
          new CustomEvent(EVENT_LISTENER.L0_COMMENT_CREATED, {
            detail: {
              referenceId: data.created.data.referenceId,
              comment: data.created.data as Amity.Comment,
            },
          }),
        );
      }
      setTextValue({
        data: { text: '' },
        mentionees: [],
        metadata: {},
        links: [],
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
      className={clsx(
        styles.commentComposer,
        isDesktop && replyTo && styles['commentComposer--desktopReply'],
        commentComposerClassName,
      )}
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
        {!isDesktop && inlineError && (
          <div className={styles.commentComposer__inlineError}>
            <Notification
              icon={<ExclamationCircle className={styles.commentComposer__notificationIcon} />}
              content={inlineError}
              className={styles.commentComposer__inlineErrorNotification}
            />
          </div>
        )}
        <div className={styles.commentComposer__mentionContainer} ref={mentionContainerRef} />
        {replyTo && (!isDesktop || isStoryPage) && (
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
                {replyTo?.creator?.displayName ?? replyTo?.userId}
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
            // Re-mount editor only when a new reply target is set (not on cancel)
            // so the initial @mention value is correctly applied from the start.
            key={editorKey}
            ref={editorRef}
            mentionContainer={mentionContainerRef?.current}
            onChange={({ text, mentioned, mentionees, links }) => {
              setTextValue({
                data: {
                  text: text,
                },
                mentionees: mentionees,
                metadata: {
                  mentioned: mentioned,
                },
                links: links || [],
              });
            }}
            onFocus={() => {
              // Scroll composer into view when user taps on input
              if (composerInputRef.current) {
                setTimeout(() => {
                  composerInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
              }
            }}
            targetType={referenceType}
            targetId={referenceId}
            value={initialCommentValue}
            placehoder={
              replyTo ? `Replying to ${replyTo?.creator?.displayName}` : 'Say something nice...'
            }
            communityId={community?.communityId}
            shouldAutoFocus={
              (isFromCommentClick || !!replyTo) && (!replyTo || editorKey === replyTo.commentId)
            }
          />
        </div>
        <Button
          variant="text"
          data-testid={`${pageId}/${componentId}/comment_composer_post`}
          isDisabled={!textValue?.data?.text || isPending}
          className={styles.commentComposer__button}
          onPressStart={() => {
            if (!online) {
              if (!isDesktop) {
                showInlineError('No internet connection.');
              } else {
                notification.info({
                  content: 'No internet connection.',
                  alignment: 'withSidebar',
                });
              }
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
