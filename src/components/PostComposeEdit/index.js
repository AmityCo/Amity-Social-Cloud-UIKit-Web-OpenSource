import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PostRepository } from 'eko-sdk';
import { customizableComponent } from 'hocs/customization';
import {
  PostComposeContainer,
  PostComposeTextarea,
  PostComposeTextareaWrapper,
  Footer,
  FooterActionBar,
  PostContainer,
  PostButton,
} from 'components/PostCompose/styles';

const PostComposeEdit = ({
  post,
  className = null,
  placeholder = "What's going on...",
  onSave = null,
}) => {
  const [text, setText] = useState(post.data.text);
  const isEmpty = text.trim().length === 0;

  const handleEditTextPost = () => {
    if (isEmpty) return;
    const editPostLiveObject = PostRepository.updatePost({
      postId: post.postId,
      data: {
        text,
      },
    });
    onSave && onSave(post.postId, text);
    setText('');
    editPostLiveObject.dispose();
  };

  return (
    <PostComposeContainer className={className} edit>
      <PostContainer>
        <PostComposeTextareaWrapper edit>
          <PostComposeTextarea
            placeholder={placeholder}
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </PostComposeTextareaWrapper>
        <Footer edit>
          <FooterActionBar>
            <PostButton disabled={isEmpty} onClick={handleEditTextPost}>
              Save
            </PostButton>
          </FooterActionBar>
        </Footer>
      </PostContainer>
    </PostComposeContainer>
  );
};

PostComposeEdit.propTypes = {
  post: PropTypes.object.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onSave: PropTypes.func,
};

export default customizableComponent('PostComposeEdit', PostComposeEdit);
