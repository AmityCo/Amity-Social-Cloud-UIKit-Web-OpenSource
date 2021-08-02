import React, { useState, useRef, useEffect } from 'react';
import { useIntl } from 'react-intl';

import customizableComponent from '~/core/hocs/customization';
import useUser from '~/core/hooks/useUser';
import withSDK from '~/core/hocs/withSDK';

import {
  Avatar,
  CommentComposeBarContainer,
  CommentComposeBarInput,
  AddCommentButton,
} from './styles';

import { backgroundImage as UserImage } from '~/icons/User';

const CommentComposeBar = ({ className, userToReply, onSubmit, currentUserId }) => {
  const [text, setText] = useState('');
  const { file } = useUser(currentUserId);

  const { formatMessage } = useIntl();

  const addComment = () => {
    if (text === '') return;
    onSubmit(text);
    setText('');
  };

  const isEmpty = text === '';

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
        placeholder={placeholder}
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        ref={commentInputRef}
        /* onKeyPress={e => e.key === 'Enter' && addComment()} */
      />
      <AddCommentButton disabled={isEmpty} onClick={addComment}>
        {submitButtonText}
      </AddCommentButton>
    </CommentComposeBarContainer>
  );
};

export default withSDK(customizableComponent('CommentComposeBar', CommentComposeBar));
