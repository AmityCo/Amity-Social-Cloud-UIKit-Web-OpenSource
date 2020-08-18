import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { customizableComponent } from '../hoks/customization';

import {
  Avatar,
  CommentComposeBarContainer,
  CommentComposeBarInput,
  AddCommentButton,
} from './styles';

const CommentComposeBar = ({ onSubmit }) => {
  const [comment, setComment] = useState('');

  const AddComment = () => {
    if (comment === '') return;
    onSubmit(comment);
    setComment('');
  };

  const isEmpty = comment === '';

  return (
    <CommentComposeBarContainer>
      <Avatar />
      <CommentComposeBarInput
        placeholder="Say something nice"
        type="text"
        value={comment}
        onChange={e => setComment(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && AddComment()}
      />
      <AddCommentButton disabled={isEmpty} onClick={AddComment}>
        Add comment
      </AddCommentButton>
    </CommentComposeBarContainer>
  );
};

export default customizableComponent('CommentComposeBar')(CommentComposeBar);
