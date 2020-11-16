import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import { UserRepository, CommunityRepository, PostRepository, EkoPostTargetType } from 'eko-sdk';

import { isEmpty } from '~/helpers';
import withSDK from '~/core/hocs/withSDK';
import useUser from '~/core/hooks/useUser';
import useLiveObject from '~/core/hooks/useLiveObject';
import useFile from '~/core/hooks/useFile';
import { notification } from '~/core/components/Notification';
import ConditionalRender from '~/core/components/ConditionalRender';

import { backgroundImage as UserImage } from '~/icons/User';
import { backgroundImage as CommunityImage } from '~/icons/Community';

import PostTargetSelector from './components/PostTargetSelector';
import UploaderButtons from './components/UploaderButtons';
import ImagesUploaded from './components/ImagesUploaded';
import FilesUploaded from './components/FilesUploaded';

import {
  Avatar,
  PostCreatorContainer,
  Footer,
  PostContainer,
  PostButton,
  UploadsContainer,
  PostInputText,
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
  hasMoreCommunities,
  loadMoreCommunities,
  onCreateSuccess = () => {},
  maxFiles = 10,
}) => {
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

  const [postText, setPostText] = useState('');
  const [postImages, setPostImages] = useState([]);
  const [postFiles, setPostFiles] = useState([]);

  // Images/files incoming from uploads.
  const [incomingImages, setIncomingImages] = useState([]);
  const [incomingFiles, setIncomingFiles] = useState([]);

  const [uploadLoading, setUploadLoading] = useState(false);
  const isDisabled = isEmpty(postText, postImages, postFiles) || uploadLoading;

  const createPost = async () => {
    const payload = {};

    if (postText) payload.text = postText;
    if (postImages.length) payload.imageIds = postImages.map(i => i.fileId);
    if (postFiles.length) payload.fileIds = postFiles.map(f => f.fileId);

    const newPostLiveObject = PostRepository.createPost({
      ...payload,
      ...target,
    });

    newPostLiveObject.on('dataStatusChanged', () => {
      const { postId } = newPostLiveObject.model;
      onCreateSuccess(postId);
      setPostText('');
      setPostImages([]);
      setPostFiles([]);
      setIncomingImages([]);
      setIncomingFiles([]);

      newPostLiveObject.dispose();
    });
  };

  const onMaxFilesLimit = () => {
    notification.info({
      content: <FormattedMessage id="upload.attachmentLimit" values={{ maxFiles }} />,
    });
  };

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
        <PostInputText
          multiline
          value={postText}
          onChange={text => setPostText(text)}
          placeholder={placeholder}
          append={
            <UploadsContainer>
              <ImagesUploaded
                files={incomingImages}
                onLoadingChange={setUploadLoading}
                onChange={uploadedImages => setPostImages(uploadedImages)}
                uploadLoading={uploadLoading}
              />
              <FilesUploaded
                files={incomingFiles}
                onLoadingChange={setUploadLoading}
                onChange={uploadedFiles => setPostFiles(uploadedFiles)}
                uploadLoading={uploadLoading}
              />
            </UploadsContainer>
          }
        />
        <Footer>
          <UploaderButtons
            imageUploadDisabled={postFiles.length > 0 || uploadLoading}
            fileUploadDisabled={postImages.length > 0 || uploadLoading}
            onChangeImages={newImages => setIncomingImages(newImages)}
            onChangeFiles={newFiles => setIncomingFiles(newFiles)}
            onMaxFilesLimit={onMaxFilesLimit}
            fileLimitRemaining={maxFiles - postFiles.length - postImages.length}
            uploadLoading={uploadLoading}
          />
          <PostButton disabled={isDisabled} onClick={createPost}>
            <FormattedMessage id="post" />
          </PostButton>
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
  hasMoreCommunities: PropTypes.bool,
  loadMoreCommunities: PropTypes.func,
  enablePostTargetPicker: PropTypes.bool,
  maxFiles: PropTypes.number,
};

export default withSDK(PostCreatorBar);
