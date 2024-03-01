import React, { useEffect, useRef } from 'react';
import useUser from '~/core/hooks/useUser';
import useSocialMention from '~/social/hooks/useSocialMention';

import { Mentionees, Metadata } from '~/helpers/utils';
import useSDK from '~/core/hooks/useSDK';
import { LoadingIndicator } from '~/core/components/ProgressBar/styles';
import { useIntl, FormattedMessage } from 'react-intl';
import { info } from '~/core/components/Confirm';

import {
  Avatar,
  CommentComposeBarContainer,
  CommentComposeBarInput,
  AddCommentButton,
  ReplyContainer,
  AnimatedReplyContainer,
} from './styles';

import { backgroundImage as UserImage } from '~/icons/User';
import useImage from '~/core/hooks/useImage';
import useStory from '~/social/hooks/useStory';
import { Close } from '~/icons';

const TOTAL_MENTIONEES_LIMIT = 30;
const COMMENT_LENGTH_LIMIT = 50000;

export interface CommentComposeBarProps {
  className?: string;
  userToReply?: string;
  onSubmit: (text: string, mentionees: Mentionees, metadata: Metadata) => void;
  onCancelReply?: () => void;
  storyId?: string;
  isReplying?: boolean;
}

const CommentComposeBar = ({
  className,
  userToReply,
  onSubmit,
  onCancelReply,
  storyId,
  isReplying,
}: CommentComposeBarProps) => {
  const story = useStory(storyId);
  const { currentUserId } = useSDK();
  const user = useUser(currentUserId);
  const avatarFileUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });
  const { text, markup, mentions, mentionees, metadata, onChange, clearAll, queryMentionees } =
    useSocialMention({
      targetId: story?.targetId,
      targetType: story?.targetType as string,
    });
  const { formatMessage } = useIntl();

  const commentInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    commentInputRef.current?.focus();
  }, []);

  if (story == null) return <LoadingIndicator />;

  const addComment = () => {
    if (text === '') return;

    if (mentions && mentions?.length > TOTAL_MENTIONEES_LIMIT) {
      return info({
        title: <FormattedMessage id="CommentComposeBar.unableToMention" />,
        content: <FormattedMessage id="CommentComposeBar.overMentionees" />,
        okText: <FormattedMessage id="CommentComposeBar.okText" />,
      });
    }

    if (text?.length > COMMENT_LENGTH_LIMIT) {
      return info({
        title: <FormattedMessage id="CommentComposeBar.unableToPost" />,
        content: <FormattedMessage id="CommentComposeBar.overCharacter" />,
        okText: <FormattedMessage id="CommentComposeBar.done" />,
      });
    }

    onSubmit?.(text, mentionees, metadata);
    clearAll?.();
  };

  const isEmpty = text === '';

  const placeholder = userToReply
    ? formatMessage({ id: 'CommentComposeBar.replayTo' }) + userToReply
    : formatMessage({ id: 'CommentComposeBar.saySomething' });

  return (
    <>
      {/* {isReplying && (
        <AnimatedReplyContainer>
          <div>Replying to </div>
          <Close onClick={onCancelReply} />
        </AnimatedReplyContainer>
      )} */}
      <CommentComposeBarContainer className={className}>
        <Avatar size="small" avatar={avatarFileUrl} backgroundImage={UserImage} />
        <CommentComposeBarInput
          ref={commentInputRef}
          data-qa-anchor="comment-compose-bar-textarea"
          placeholder={placeholder}
          value={markup}
          multiline
          mentionAllowed
          queryMentionees={queryMentionees}
          onChange={(data) => onChange?.(data)}
          onKeyPress={(e) => e.key === 'Enter' && addComment()}
        />
        <AddCommentButton
          data-qa-anchor={
            userToReply
              ? 'comment-compose-bar-reply-button'
              : 'comment-compose-bar-add-comment-button'
          }
          disabled={isEmpty}
          onClick={addComment}
        >
          {formatMessage({ id: 'storyViewer.commentComposeBar.submit' })}
        </AddCommentButton>
      </CommentComposeBarContainer>
    </>
  );
};

export default CommentComposeBar;
