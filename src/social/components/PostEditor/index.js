import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PostRepository } from 'eko-sdk';
import customizableComponent from '~/core/hocs/customization';
import { isEmpty } from '~/helpers';
import {
  PostCreatorContainer,
  PostCreatorTextarea,
  PostCreatorTextareaWrapper,
  Footer,
  FooterActionBar,
  PostContainer,
  PostButton,
} from '~/social/components/PostCreator/styles';

const PostEditor = ({
  post,
  className = null,
  placeholder = "What's going on...",
  onSave = null,
}) => {
  const [text, setText] = useState(post?.data?.text ?? '');

  const handleEditTextPost = () => {
    if (isEmpty(text)) return;
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
    <PostCreatorContainer className={className} edit>
      <PostContainer>
        <PostCreatorTextareaWrapper edit>
          <PostCreatorTextarea
            placeholder={placeholder}
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </PostCreatorTextareaWrapper>
        <Footer edit>
          <FooterActionBar>
            <PostButton disabled={isEmpty(text)} onClick={handleEditTextPost}>
              Save
            </PostButton>
          </FooterActionBar>
        </Footer>
      </PostContainer>
    </PostCreatorContainer>
  );
};

PostEditor.propTypes = {
  post: PropTypes.object.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onSave: PropTypes.func,
};

export default customizableComponent('PostEditor', PostEditor);
