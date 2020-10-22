import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { PostRepository, EkoPostTargetType } from 'eko-sdk';
import { v4 } from 'uuid';

import { isEqual } from 'helpers';
import Images from '~/social/components/Images';
import { ImageUpload } from '~/social/components/Images/ImageUpload';

import Files from '~/core/components/Uploaders/File';
import { confirm } from '~/core/components/Confirm';
import { ConditionalRender } from '~/core/components/ConditionalRender';
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
  onCreateSuccess = () => {},
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
  const [files, setFiles] = useState(post.files);
  const [images, setImages] = useState(post.images);

  const [isDirty, markDirty] = useState(false);

  const hasNotLoadedImages = images.some(image => image.isNew);
  const hasNotLoadedFiles = files.some(file => file.isNew);

  const isEmpty = text.trim().length === 0 && files.length === 0 && images.length === 0;
  const isDisabled = isEmpty || hasNotLoadedImages || hasNotLoadedFiles;

  if (blockRouteChange) {
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
  }

  useEffect(() => {
    markDirty(
      !isEqual(text, post.text) || !isEqual(files, post.files) || !isEqual(images, post.images),
    );
  }, [text, files, images]);

  const createImagePost = parentPostId => {
    if (images.length) {
      const imageIds = images.map(image => image.fileId);
      PostRepository.createImagePost({
        imageIds,
        targetType,
        targetId: parentPostId || targetId,
      });
    }
  };

  const createPost = async () => {
    if (isEmpty) return;

    if (!text) {
      createImagePost();
    } else {
      const newPostLiveObject = PostRepository.createTextPost({
        text,
        targetType,
        targetId,
      });

      newPostLiveObject.on('dataStatusChanged', () => {
        const { postId } = newPostLiveObject.model;
        onCreateSuccess(postId);
        setText('');

        createImagePost(postId);

        setFiles([]);
        newPostLiveObject.dispose();
      });
    }
  };

  const FilePostIcon = () => null;
  const maxFilesWarning = 0;
  const canUploadImage = !files.length;
  const canUploadFile = !images.length;

  const updatePost = async () => {
    // TODO: fixme
  };

  const isCommunityPost = isIdenticalAuthor(author, community);

  const addImages = added => {
    const newImages = added.map(image => ({ ...image, isNew: true }));
    setImages(oldImages => [...oldImages, ...newImages]);
  };

  const updateImages = fileIds => {
    setImages(oldImages =>
      oldImages.map((image, index) => {
        return { ...image, isNew: false, fileId: fileIds[index] };
      }),
    );
  };

  const setProgress = ({ imageName, progress }) => {
    setImages(oldImages => {
      const index = oldImages.findIndex(image => image.name === imageName);
      return [
        ...oldImages.slice(0, index),
        { ...oldImages[index], progress },
        ...oldImages.slice(index + 1),
      ];
    });
  };

  const addFile = file => {
    setFiles([...files, { ...file, id: v4(), isNew: true }]);
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
    setImages(oldImages => {
      return oldImages.filter(({ name }) => name !== image.name);
    });
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

          <ConditionalRender condition={files.length}>
            <Files setFileLoaded={setFileLoaded} files={files} onRemove={onRemoveFile} />
          </ConditionalRender>
          <ConditionalRender condition={images.length}>
            <Images images={images} onRemove={onRemoveImage} />
          </ConditionalRender>
        </PostComposeTextareaWrapper>
        <Footer>
          <ConditionalRender condition={community}>
            <PostAsCommunity value={isCommunityPost} onChange={setIsCommunityPost} />
          </ConditionalRender>
          <FooterActionBar>
            <ConditionalRender condition={!edit}>
              <ImageUpload
                disabled={!canUploadImage}
                addImages={addImages}
                updateImages={updateImages}
                setProgress={setProgress}
              />
              <FilePostIcon
                disabled={!canUploadFile}
                onClick={canUploadFile ? addFile : maxFilesWarning}
              />
            </ConditionalRender>
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
  blockRouteChange: PropTypes.func,
  edit: PropTypes.bool,
  post: PropTypes.shape({
    text: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    files: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default customizableComponent('PostComposeBar', PostComposeBar);
