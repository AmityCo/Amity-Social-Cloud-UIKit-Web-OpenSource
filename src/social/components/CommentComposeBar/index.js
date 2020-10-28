import React, { useState, useRef, useEffect } from 'react';

import customizableComponent from '~/core/hocs/customization';
import useUser from '~/core/hooks/useUser';
import withSDK from '~/core/hocs/withSDK';

import {
  Avatar,
  CommentComposeBarContainer,
  CommentComposeBarInput,
  AddCommentButton,
} from './styles';

const CommentComposeBar = ({ className, userToReply, onSubmit, currentUserId }) => {
  const [text, setText] = useState('');
  const currentUser = useUser(currentUserId);

  const addComment = () => {
    if (text === '') return;
    onSubmit(text);
    setText('');
  };

  const isEmpty = text === '';

  const placeholder = userToReply ? `Reply to ${userToReply}` : 'Say something nice';
  const submitButtonText = userToReply ? 'Reply' : 'Add comment';

  const commentInputRef = useRef();
  useEffect(() => {
    commentInputRef.current.focus();
  }, []);

  return (
    <CommentComposeBarContainer className={className}>
      <Avatar avatar={currentUser.avatar} />
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
