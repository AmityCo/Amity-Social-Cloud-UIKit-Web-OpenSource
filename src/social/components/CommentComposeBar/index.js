import React, { useRef, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, ButtonGroup } from '@noom/wax-component-library';

import customizableComponent from '~/core/hocs/customization';
import usePost from '~/social/hooks/usePost';
import useUser from '~/core/hooks/useUser';
import useSocialMention from '~/social/hooks/useSocialMention';
import withSDK from '~/core/hocs/withSDK';
import { info } from '~/core/components/Confirm';

import {
  Avatar,
  CommentComposeBarContainer,
  CommentComposeBarInput,
  AddCommentButton,
} from './styles';

import { backgroundImage as UserImage } from '~/icons/User';
import { extractMetadata } from '../../../helpers/utils';

const TOTAL_MENTIONEES_LIMIT = 30;
const COMMENT_LENGTH_LIMIT = 50000;

const CommentComposeBar = ({
  className,
  userToReply,
  onSubmit,
  onCancel,
  currentUserId,
  postId,
}) => {
  const { post } = usePost(postId);
  const { targetId: communityId, targetType: communityType } = post;

  const { file } = useUser(currentUserId);
  const { text, markup, mentions, onChange, clearAll, queryMentionees } = useSocialMention({
    targetId: communityId,
    targetType: communityType,
  });
  const { formatMessage } = useIntl();

  const addComment = () => {
    if (text === '') return;

    if (mentions?.length > TOTAL_MENTIONEES_LIMIT) {
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

    const { metadata, mentionees } = extractMetadata(mentions);

    onSubmit(text, mentionees, metadata);
    clearAll();
  };

  const isEmpty = !text || text?.trim().length === 0;

  const placeholder = userToReply
    ? formatMessage({ id: 'CommentComposeBar.replayTo' }) + userToReply
    : formatMessage({ id: 'CommentComposeBar.saySomething' });
  const submitButtonText = userToReply
    ? formatMessage({ id: 'reply' })
    : formatMessage({ id: 'CommentComposeBar.addComment' });

  const commentInputRef = useRef();
  useEffect(() => {
    commentInputRef.current.focus();
  }, []);

  return (
    <CommentComposeBarContainer className={className}>
      <Avatar avatar={file?.fileUrl} backgroundImage={UserImage} />
      <CommentComposeBarInput
        ref={commentInputRef}
        placeholder={placeholder}
        type="text"
        value={markup}
        multiline
        mentionAllowed
        queryMentionees={queryMentionees}
        onChange={onChange}
      />
      <ButtonGroup size="md" isFullWidth>
        <Button variant="outline" onClick={onCancel}>
          <FormattedMessage id="cancel" />
        </Button>
        <Button disabled={isEmpty} onClick={addComment} colorScheme="primary">
          {submitButtonText}
        </Button>
      </ButtonGroup>
    </CommentComposeBarContainer>
  );
};

export default withSDK(customizableComponent('CommentComposeBar', CommentComposeBar));
