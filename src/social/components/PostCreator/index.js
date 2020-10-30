import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { PostRepository, EkoPostTargetType } from 'eko-sdk';

import { isEmpty, isEqual } from '~/helpers';
import useFilesUpload from '~/core/hooks/useFilesUpload';
import Images from '~/social/components/Images';
import { ImageUpload } from '~/social/components/Images/ImageUpload';

import { Files } from '~/core/components/Files';
import { FileUpload } from '~/core/components/Files/FileUpload';
import { confirm } from '~/core/components/Confirm';
import ConditionalRender from '~/core/components/ConditionalRender';
import customizableComponent from '~/core/hocs/customization';
import PostAsCommunity from './PostAsCommunity';
import PostTargetSelector from './PostTargetSelector';
import { isIdenticalAuthor } from './utils';
import {
  PostCreatorContainer,
  PostCreatorTextarea,
  PostCreatorTextareaWrapper,
  Footer,
  FooterActionBar,
  PostContainer,
  PostButton,
} from './styles';

const PostCreatorBar = ({
  onCreateSuccess = () => {},
  community = {},
  communities = [],
  className = '',
  placeholder = "What's going on...",
  edit,
  post = { text: '', files: [], images: [] },
  blockRouteChange,
  isModerator,
  hasMoreCommunities,
  loadMoreCommunities,
  disablePostToCommunity,
}) => {
  const user = {};
  const [author, setAuthor] = useState(user);
  const [postAvatar, setPostAvatar] = useState(user.avatar);

  const [text, setText] = useState(post.text);

  const {
    files: images,
    addFiles: addImages,
    updateFiles: updateImages,
    setProgress: setImagesProgress,
    removeFile: removeImage,
    reset: resetImages,
  } = useFilesUpload(post.images);

  const {
    files,
    addFiles,
    updateFiles,
    setProgress: setFilesProgress,
    removeFile,
    reset: resetFiles,
  } = useFilesUpload(post.files);

  const [isDirty, markDirty] = useState(false);

  const hasNotLoadedImages = images.some(image => image.isNew);
  const hasNotLoadedFiles = files.some(file => file.isNew);

  const isDisabled = isEmpty(text, images, files) || hasNotLoadedImages || hasNotLoadedFiles;

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

  const createPost = async () => {
    if (isEmpty(text, images, files)) {
      return;
    }

    const payload = {};
    if (text) {
      payload.text = text;
    }

    if (images.length) {
      payload.imageIds = images.map(image => image.fileId);
    }

    if (files.length) {
      payload.fileIds = files.map(file => file.fileId);
    }

    if (isEmpty(payload)) {
      return;
    }

    const newPostLiveObject = PostRepository.createPost({
      ...payload,
      targetType: author.communityId ? EkoPostTargetType.CommunityFeed : EkoPostTargetType.UserFeed,
      targetId: author.communityId || author.userId,
    });

    newPostLiveObject.on('dataStatusChanged', () => {
      const { postId } = newPostLiveObject.model;
      onCreateSuccess(postId);
      setText('');
      resetImages();
      resetFiles();

      newPostLiveObject.dispose();
    });
  };

  const canUploadImage = !files.length;
  const canUploadFile = !images.length;

  const updatePost = async () => {
    // TODO: fixme
  };

  const isCommunityPost = isIdenticalAuthor(author, community);
  const setIsCommunityPost = shouldBeCommunityPost =>
    setAuthor(shouldBeCommunityPost ? community : user);

  return (
    <PostCreatorContainer className={cx('postComposeBar', className)} edit={edit}>
      <PostTargetSelector
        author={author}
        user={user}
        communities={communities}
        hasMoreCommunities={hasMoreCommunities}
        loadMoreCommunities={loadMoreCommunities}
        onChange={setAuthor}
        postAvatar={postAvatar}
        setPostAvatar={setPostAvatar}
        disablePostToCommunity={disablePostToCommunity}
      />
      <PostContainer>
        <PostCreatorTextareaWrapper>
          <PostCreatorTextarea
            placeholder={placeholder}
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
          />

          <ConditionalRender condition={files.length}>
            <Files files={files} onRemove={removeFile} />
          </ConditionalRender>
          <ConditionalRender condition={images.length}>
            <Images images={images} onRemove={removeImage} />
          </ConditionalRender>
        </PostCreatorTextareaWrapper>
        <Footer>
          <ConditionalRender condition={isModerator && !isEmpty(community)}>
            <PostAsCommunity value={isCommunityPost} onChange={setIsCommunityPost} />
          </ConditionalRender>
          <FooterActionBar>
            <ConditionalRender condition={!edit}>
              <>
                <ImageUpload
                  disabled={!canUploadImage}
                  addImages={addImages}
                  updateImages={updateImages}
                  setProgress={setImagesProgress}
                />
                <FileUpload
                  disabled={!canUploadFile}
                  addFiles={addFiles}
                  updateFiles={updateFiles}
                  setProgress={setFilesProgress}
                />
              </>
            </ConditionalRender>
            <PostButton disabled={isDisabled} onClick={edit ? updatePost : createPost}>
              {edit ? 'Save' : 'Post'}
            </PostButton>
          </FooterActionBar>
        </Footer>
      </PostContainer>
    </PostCreatorContainer>
  );
};

PostCreatorBar.propTypes = {
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
  isModerator: PropTypes.bool,
  hasMoreCommunities: PropTypes.bool,
  loadMoreCommunities: PropTypes.func,
  disablePostToCommunity: PropTypes.bool,
};

export default customizableComponent('PostCreatorBar', PostCreatorBar);
