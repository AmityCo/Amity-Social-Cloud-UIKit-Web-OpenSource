import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { PostRepository, EkoPostTargetType } from 'eko-sdk';
import { customizableComponent } from 'hocs/customization';
import Files from 'components/Files';
import Images from 'components/Images';
import PostAsCommunity from './PostAsCommunity';
import AuthorSelector from './AuthorSelector';
import { isIdenticalAuthor } from './utils';
import {
  PostComposeContainer,
  PostComposeTextarea,
  PostComposeTextareaWrapper,
  Footer,
  FooterActionBar,
  PostContainer,
  PostButton,
} from './styles';

const PostComposeBar = ({
  targetType,
  targetId,
  onCreateSuccess = null,
  community = null,
  communities = [],
  className = '',
  placeholder = "What's going on...",
}) => {
  const user = {};
  const [author, setAuthor] = useState(user);
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const isEmpty = text.trim().length === 0 && files.length === 0 && images.length === 0;

  const handleCreateTextPost = async () => {
    if (isEmpty) return;
    const newPostLiveObject = PostRepository.createTextPost({
      text,
      targetType,
      targetId,
    });

    newPostLiveObject.on('dataStatusChanged', () => {
      onCreateSuccess(newPostLiveObject.model.postId);
      setText('');
      newPostLiveObject.dispose();
    });
  };

  const isCommunityPost = isIdenticalAuthor(author, community);

  const setIsCommunityPost = shouldBeCommunityPost =>
    setAuthor(shouldBeCommunityPost ? community : user);

  return (
    <PostComposeContainer className={cx('postComposeBar', className)}>
      <AuthorSelector author={author} user={user} communities={communities} onChange={setAuthor} />
      <PostContainer>
        <PostComposeTextareaWrapper>
          <PostComposeTextarea
            placeholder={placeholder}
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
          />

          {!!files.length && <Files editing files={files} onRemove={() => {}} />}
          {!!images.length && <Images editing images={images} onRemove={() => {}} />}
        </PostComposeTextareaWrapper>
        <Footer>
          {!!community && <PostAsCommunity value={isCommunityPost} onChange={setIsCommunityPost} />}
          <FooterActionBar>
            <PostButton disabled={isEmpty} onClick={handleCreateTextPost}>
              Post
            </PostButton>
          </FooterActionBar>
        </Footer>
      </PostContainer>
    </PostComposeContainer>
  );
};

PostComposeBar.propTypes = {
  targetType: PropTypes.oneOf(Object.values(EkoPostTargetType)).isRequired,
  targetId: PropTypes.string,
  onCreateSuccess: PropTypes.func,
  community: PropTypes.object,
  communities: PropTypes.array,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

export default customizableComponent('PostComposeBar', PostComposeBar);
