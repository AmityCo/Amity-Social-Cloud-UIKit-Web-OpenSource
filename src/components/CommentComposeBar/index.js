import React, { useState } from 'react';

import { customizableComponent } from 'hocs/customization';

import { testUser } from 'mock';

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
    onSubmit({
      author: user,
      text,
      createdAt: Date.now(),
    });
    setText('');
  };

  const isEmpty = text === '';

  const placeholder = userToReply ? `Reply to ${userToReply.name}` : 'Say something nice';
  const submitButtonText = userToReply ? 'Reply' : 'Add comment';

  return (
    <CommentComposeBarContainer className={className}>
      <Avatar avatar={user.avatar} />
      <CommentComposeBarInput
        placeholder={placeholder}
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        /* onKeyPress={e => e.key === 'Enter' && AddComment()} */
      />
      <AddCommentButton disabled={isEmpty} onClick={AddComment}>
        {submitButtonText}
      </AddCommentButton>
    </CommentComposeBarContainer>
  );
};

export default customizableComponent('CommentComposeBar')(CommentComposeBar);
