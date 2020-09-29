import React, { useState, useRef, useEffect } from 'react';

import { customizableComponent } from '~/core/hocs/customization';

import { testUser } from '~/mock';

import {
  Avatar,
  CommentComposeBarContainer,
  CommentComposeBarInput,
  AddCommentButton,
} from './styles';

const CommentComposeBar = ({ className, userToReply, onSubmit, user = testUser }) => {
  const [text, setText] = useState('');

  const AddComment = () => {
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
      <Avatar avatar={user.avatar} />
      <CommentComposeBarInput
        placeholder={placeholder}
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        ref={commentInputRef}
        /* onKeyPress={e => e.key === 'Enter' && AddComment()} */
      />
      <AddCommentButton disabled={isEmpty} onClick={AddComment}>
        {submitButtonText}
      </AddCommentButton>
    </CommentComposeBarContainer>
  );
};

export default customizableComponent('CommentComposeBar', CommentComposeBar);
