import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { PostRepository, EkoPostTargetType } from 'eko-sdk';
import { isEqual } from 'helpers';
import Images from '~/social/components/Images';

import Files from '~/core/components/Files';
import { confirm } from '~/core/components/Confirm';
import { customizableComponent } from '~/core/hocs/customization';
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
  edit,
  post = { text: '', files: [], images: [] },
  blockRouteChange,
}) => {
  const user = {};
  const [author, setAuthor] = useState(user);
  const [text, setText] = useState(post.text);
  // TODO: refactor method to create post with images and files
  // const [files, setFiles] = useState(post.files);
  // const [images, setImages] = useState(post.images);
  const files = [];
  const images = [];

  const [isDirty, markDirty] = useState(false);

  const hasNotLoadedImages = images.some(image => image.isNew);
  const hasNotLoadedFiles = files.some(file => file.isNew);

  const isEmpty = text.trim().length === 0 && files.length === 0 && images.length === 0;
  const isDisabled = isEmpty || hasNotLoadedImages || hasNotLoadedFiles;

  const onConfirm = goToNextPage => () => {
    blockRouteChange(() => true);
    goToNextPage();
    markDirty(false);
  };

  blockRouteChange(goToNextPage => {
    if (isDirty) {
      confirm({
        title: 'Leave without finishing?',
        content: 'Your progress won’t be saved. Are you sure to leave this page now?',
        cancelText: 'Continue editing',
        okText: 'Leave',
        onOk: onConfirm(goToNextPage),
      });
    }

    return !isDirty;
  });

  useEffect(() => {
    markDirty(
      !isEqual(text, post.text) || !isEqual(files, post.files) || !isEqual(images, post.images),
    );
  }, [text, files, images]);

  const createPost = async () => {
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

  const testImages = [];
  const testFiles = [];
  const setImages = () => {};
  const setFiles = () => {};
  const ImagePostIcon = () => null;
  const FilePostIcon = () => null;
  const maxImagesWarning = 0;
  const maxFilesWarning = 0;
  const canUploadImage = false;
  const canUploadFile = false;

  const updatePost = async () => {
    // TODO: fixme
  };

  const isCommunityPost = isIdenticalAuthor(author, community);
  const addImage = () => {
    const image = testImages[images.length % testImages.length];
    setImages([...images, { id: Date.now(), isNew: true, ...image }]);
  };

  const addFile = () => {
    const file = testFiles[files.length % testFiles.length];
    setFiles([...files, { id: Date.now(), isNew: true, ...file }]);
  };

  const setImageLoaded = image => {
    const index = images.indexOf(image);
    const newImages = images.slice();
    newImages[index] = {
      ...image,
      isNew: false,
    };
    setImages(newImages);
  };

  const setFileLoaded = file => {
    const index = files.indexOf(file);
    const newFiles = files.slice();
    newFiles[index] = {
      ...file,
      isNew: false,
    };
    setFiles(newFiles);
  };

  const onRemoveFile = file => {
    setFiles(files.filter(({ id }) => id !== file.id));
  };

  const onRemoveImage = image => {
    setImages(images.filter(({ id }) => id !== image.id));
  };

  const setIsCommunityPost = shouldBeCommunityPost =>
    setAuthor(shouldBeCommunityPost ? community : user);

  return (
    <PostComposeContainer className={cx('postComposeBar', className)} edit={edit}>
      <AuthorSelector author={author} user={user} communities={communities} onChange={setAuthor} />
      <PostContainer>
        <PostComposeTextareaWrapper>
          <PostComposeTextarea
            placeholder={placeholder}
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
          />

          {!!files.length && (
            <Files setFileLoaded={setFileLoaded} files={files} onRemove={onRemoveFile} />
          )}
          {!!images.length && (
            <Images setImageLoaded={setImageLoaded} images={images} onRemove={onRemoveImage} />
          )}
        </PostComposeTextareaWrapper>
        <Footer>
          {!!community && <PostAsCommunity value={isCommunityPost} onChange={setIsCommunityPost} />}
          <FooterActionBar>
            <ImagePostIcon
              disabled={!canUploadImage}
              onClick={canUploadImage ? addImage : maxImagesWarning}
            />
            <FilePostIcon
              disabled={!canUploadFile}
              onClick={canUploadFile ? addFile : maxFilesWarning}
            />
            <PostButton disabled={isDisabled} onClick={edit ? updatePost : createPost}>
              {edit ? 'Save' : 'Post'}
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
  blockRouteChange: PropTypes.func.isRequired,
  edit: PropTypes.bool,
  post: PropTypes.shape({
    text: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    files: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default customizableComponent('PostComposeBar', PostComposeBar);
