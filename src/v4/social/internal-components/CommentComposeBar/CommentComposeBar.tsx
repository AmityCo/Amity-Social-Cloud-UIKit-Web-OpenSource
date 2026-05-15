import React, { useEffect, useRef } from 'react';
import { useString, resolveString } from '~/v4/core/localization';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import useMention from '~/v4/chat/hooks/useMention';

import { Mentionees, Metadata } from '~/v4/helpers/utils';
import useSDK from '~/core/hooks/useSDK';

import styles from './CommentComposeBar.module.css';

import User, { backgroundImage as UserImage } from '~/icons/User';
import useImage from '~/core/hooks/useImage';
import { useConfirmContext } from '~/core/providers/ConfirmProvider';
import InputText from '~/v4/core/components/InputText';
import { Avatar } from '~/v4/core/components';
import Button from '~/v4/core/components/Button/Button';
import { LoadingIndicator } from '~/v4/social/internal-components/LoadingIndicator';

const TOTAL_MENTIONEES_LIMIT = 30;
const COMMENT_LENGTH_LIMIT = 50000;

interface CommentComposeBarProps {
  targetId: string;
  targetType: string;
  className?: string;
  userToReply?: Amity.User['displayName'] | null;
  onSubmit: (text: string, mentionees: Mentionees, metadata: Metadata) => void;
  onCancelReply?: () => void;
  isReplying?: boolean;
}

export const CommentComposeBar = ({
  userToReply,
  onSubmit,
  targetId,
  targetType,
}: CommentComposeBarProps) => {
  const { currentUserId } = useSDK();
  const { user } = useUser({ userId: currentUserId });
  const avatarFileUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });
  const { text, markup, mentions, mentionees, metadata, onChange, clearAll, queryMentionees } =
    useMention({
      targetId: targetId,
      targetType,
    });

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
        title: resolveString('amity_social_label_unable_to_mention'),
        content: resolveString('amity_social_label_comment_over_mentionees_limit'),
        okText: resolveString('amity_social_button_ok'),
      });
    }

    if (text?.length > COMMENT_LENGTH_LIMIT) {
      return info({
        title: resolveString('amity_social_unable_to_post'),
        content: resolveString('amity_social_error_post_text_exceed_error_message'),
        okText: resolveString('amity_social_button_done'),
      });
    }

    onSubmit?.(text, mentionees, metadata);
    clearAll?.();
  };

  const isEmpty = text === '';

  const placeholder = userToReply
    ? resolveString('amity_social_label_comment_compose_bar_reply_to') + userToReply
    : resolveString('amity_social_placeholder_comment_text_field_placeholder');

  return (
    <div className={styles.commentComposeBarContainer}>
      <div className={styles.avatar}>
        <Avatar avatarUrl={avatarFileUrl} defaultImage={<User />} />
      </div>
      <InputText
        ref={commentInputRef}
        data-testid="comment-compose-bar-textarea"
        placeholder={placeholder}
        value={markup}
        multiline
        mentionAllowed
        queryMentionees={queryMentionees}
        onChange={(data) => onChange?.(data)}
        onKeyPress={(e) => e.key === 'Enter' && addComment()}
        className={styles.commentComposeBarInput}
      />
      <Button
        variant="ghost"
        data-testid={
          userToReply
            ? 'comment-compose-bar-reply-button'
            : 'comment-compose-bar-add-comment-button'
        }
        disabled={isEmpty}
        onClick={addComment}
        className={styles.addCommentButton}
      >
        {useString('amity_social_button_post_composer_create_button')}
      </Button>
    </div>
  );
};

export default CommentComposeBar;
