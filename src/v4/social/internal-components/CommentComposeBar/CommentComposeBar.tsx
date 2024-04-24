import React, { useEffect, useRef } from 'react';
import useUser from '~/core/hooks/useUser';
import useMention from '~/v4/chat/hooks/useMention';

import { Mentionees, Metadata } from '~/v4/helpers/utils';
import useSDK from '~/core/hooks/useSDK';
import { LoadingIndicator } from '~/core/components/ProgressBar/styles';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  AddCommentButton,
  Avatar,
  CommentComposeBarContainer,
  CommentComposeBarInput,
} from './styles';

import { backgroundImage as UserImage } from '~/icons/User';
import useImage from '~/core/hooks/useImage';
import { useConfirmContext } from '~/core/providers/ConfirmProvider';

const TOTAL_MENTIONEES_LIMIT = 30;
const COMMENT_LENGTH_LIMIT = 50000;

interface CommentComposeBarProps {
  targetId: string;
  className?: string;
  userToReply?: Amity.User['displayName'] | null;
  onSubmit: (text: string, mentionees: Mentionees, metadata: Metadata) => void;
  onCancelReply?: () => void;
  isReplying?: boolean;
  style?: React.CSSProperties;
}

export const CommentComposeBar = ({
  style,
  userToReply,
  onSubmit,
  targetId,
}: CommentComposeBarProps) => {
  const { currentUserId } = useSDK();
  const user = useUser(currentUserId);
  const avatarFileUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });
  const { text, markup, mentions, mentionees, metadata, onChange, clearAll, queryMentionees } =
    useMention({
      targetId: targetId,
      targetType: 'community',
    });
  const { formatMessage } = useIntl();
  const { info } = useConfirmContext();

  const commentInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    commentInputRef.current?.focus();
  }, []);

  if (targetId == null) return <LoadingIndicator />;

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
    <CommentComposeBarContainer style={style}>
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
  );
};

export default CommentComposeBar;
