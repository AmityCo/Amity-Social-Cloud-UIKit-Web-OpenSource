import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { UserRepository, CommunityRepository, PostRepository, EkoPostTargetType } from 'eko-sdk';

import { isEmpty, isEqual } from '~/helpers';
import withSDK from '~/core/hocs/withSDK';
import useUser from '~/core/hooks/useUser';
import useLiveObject from '~/core/hooks/useLiveObject';
import useFile from '~/core/hooks/useFile';
import useFilesUpload from '~/core/hooks/useFilesUpload';
import Images from '~/social/components/Images';
import { ImageUpload } from '~/social/components/Images/ImageUpload';

import { Files } from '~/core/components/Files';
import { FileUpload } from '~/core/components/Files/FileUpload';
import { confirm } from '~/core/components/Confirm';
import ConditionalRender from '~/core/components/ConditionalRender';

import PostAsCommunity from './PostAsCommunity';
import PostTargetSelector from './PostTargetSelector';

import { backgroundImage as UserImage } from '~/icons/User';
import { backgroundImage as CommunityImage } from '~/icons/Community';

import {
  Avatar,
  PostCreatorContainer,
  PostCreatorTextarea,
  PostCreatorTextareaWrapper,
  Footer,
  FooterActionBar,
  PostContainer,
  PostButton,
} from './styles';

const communityFetcher = id => () => CommunityRepository.communityForId(id);
const userFetcher = id => () => new UserRepository().userForId(id);

const PostCreatorBar = ({
  className = '',
  currentUserId,
  targetType,
  targetId,
  enablePostTargetPicker,
  communities = [],
  placeholder = "What's going on...",
  post = { text: '', files: [], images: [] },
  hasMoreCommunities,
  loadMoreCommunities,
  onCreateSuccess = () => {},
  blockRouteChange,
}) => {
  // TODO: dont forget
  const edit = false;

  const { user } = useUser(currentUserId);

  // default to me
  if (targetType === EkoPostTargetType.GlobalFeed || targetType === EkoPostTargetType.MyFeed) {
    /* eslint-disable no-param-reassign */
    targetType = EkoPostTargetType.UserFeed;
    /* eslint-disable no-param-reassign */
    targetId = currentUserId;
  }

  const [target, setTarget] = useState({ targetType, targetId });

  useEffect(() => {
    setTarget({ targetType, targetId });
  }, [targetType, targetId]);

  const fetcher = target.targetType === EkoPostTargetType.UserFeed ? userFetcher : communityFetcher;
  const model = useLiveObject(fetcher(target.targetId), [target.targetId]);
  const { avatarFileId } = model;

  const file = useFile(avatarFileId, [avatarFileId]);

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
  const hasNotLoadedFiles = files.some(f => f.isNew);

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

    if (text) payload.text = text;
    if (images.length) payload.imageIds = images.map(i => i.fileId);
    if (files.length) payload.fileIds = files.map(f => f.fileId);

    const newPostLiveObject = PostRepository.createPost({
      ...payload,
      ...target,
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

  const backgroundImage =
    target.targetType === EkoPostTargetType.CommunityFeed ? CommunityImage : UserImage;

  const CurrentTargetAvatar = <Avatar avatar={file.fileUrl} backgroundImage={backgroundImage} />;

  return (
    <PostCreatorContainer className={cx('postComposeBar', className)}>
      <ConditionalRender condition={enablePostTargetPicker}>
        <PostTargetSelector
          user={user}
          communities={communities}
          hasMoreCommunities={hasMoreCommunities}
          loadMoreCommunities={loadMoreCommunities}
          currentTargetType={target.targetType}
          currentTargetId={target.targetId}
          onChange={setTarget}
        >
          {CurrentTargetAvatar}
        </PostTargetSelector>

        {CurrentTargetAvatar}
      </ConditionalRender>
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
          <ConditionalRender condition={false}>
            <PostAsCommunity value="" onChange="" />
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
            <PostButton disabled={isDisabled} onClick={createPost}>
              Post
            </PostButton>
          </FooterActionBar>
        </Footer>
      </PostContainer>
    </PostCreatorContainer>
  );
};

PostCreatorBar.propTypes = {
  currentUserId: PropTypes.string,
  targetType: PropTypes.string,
  targetId: PropTypes.string,
  onCreateSuccess: PropTypes.func,
  communities: PropTypes.array,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  blockRouteChange: PropTypes.func,
  post: PropTypes.shape({
    text: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    files: PropTypes.arrayOf(PropTypes.string),
  }),
  hasMoreCommunities: PropTypes.bool,
  loadMoreCommunities: PropTypes.func,
  enablePostTargetPicker: PropTypes.bool,
};

export default withSDK(PostCreatorBar);
