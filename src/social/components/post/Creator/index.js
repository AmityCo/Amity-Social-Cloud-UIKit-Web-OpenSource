import React, { memo, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import {
  UserRepository,
  CommunityRepository,
  PostRepository,
  PostTargetType,
  FileRepository,
  ImageSize,
} from '@amityco/js-sdk';
import { useAsyncCallback } from '~/core/hooks/useAsyncCallback';

import { isEmpty } from '~/helpers';
import withSDK from '~/core/hocs/withSDK';
import useUser from '~/core/hooks/useUser';
import useLiveObject from '~/core/hooks/useLiveObject';
import useErrorNotification from '~/core/hooks/useErrorNotification';
import { notification } from '~/core/components/Notification';
import ConditionalRender from '~/core/components/ConditionalRender';
import promisify from '~/helpers/promisify';

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

const MAX_FILES_PER_POST = 10;

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
  maxFiles = MAX_FILES_PER_POST,
}) => {
  const { user } = useUser(currentUserId);

  // default to me
  if (targetType === PostTargetType.GlobalFeed || targetType === PostTargetType.MyFeed) {
    /* eslint-disable no-param-reassign */
    targetType = PostTargetType.UserFeed;
    /* eslint-disable no-param-reassign */
    targetId = currentUserId;
  }

  const [target, setTarget] = useState({ targetType, targetId });

  useEffect(() => {
    setTarget({ targetType, targetId });
  }, [targetType, targetId]);

  const fetcher = target.targetType === PostTargetType.UserFeed ? userFetcher : communityFetcher;
  const model = useLiveObject(fetcher(target.targetId), [target.targetId]);
  const { avatarFileId } = model;

  // TODO: this is temporary - we should use file.fileUrl when supported.
  const fileUrl = useMemo(
    () =>
      avatarFileId &&
      FileRepository.getFileUrlById({
        fileId: avatarFileId,
        imageSize: ImageSize.Medium,
      }),
    [avatarFileId],
  );

  const [postText, setPostText] = useState('');
  const [postImages, setPostImages] = useState([]);
  const [postFiles, setPostFiles] = useState([]);

  // Images/files incoming from uploads.
  const [incomingImages, setIncomingImages] = useState([]);
  const [incomingFiles, setIncomingFiles] = useState([]);

  const [uploadLoading, setUploadLoading] = useState(false);

  const [setError] = useErrorNotification();

  const [createPost, creating] = useAsyncCallback(async () => {
    const data = {};

    if (postText) data.text = postText;
    if (postImages.length) data.images = postImages.map(i => i.fileId);
    if (postFiles.length) data.files = postFiles.map(f => f.fileId);

    const post = await promisify(
      PostRepository.createPost({
        ...target,
        data,
      }),
    );

    onCreateSuccess(post.postId);
    setPostText('');
    setPostImages([]);
    setPostFiles([]);
    setIncomingImages([]);
    setIncomingFiles([]);
  }, [postText, postImages, postFiles, target, onCreateSuccess]);

  const onMaxFilesLimit = () => {
    notification.info({
      content: <FormattedMessage id="upload.attachmentLimit" values={{ maxFiles }} />,
    });
  };

  const onFileSizeLimit = () => {
    notification.info({
      content: <FormattedMessage id="upload.fileSizeLimit" />,
    });
  };

  const backgroundImage =
    target.targetType === PostTargetType.CommunityFeed ? CommunityImage : UserImage;

  const CurrentTargetAvatar = <Avatar avatar={fileUrl} backgroundImage={backgroundImage} />;
  const isDisabled = isEmpty(postText, postImages, postFiles) || uploadLoading || creating;

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
                onError={setError}
                uploadLoading={uploadLoading}
              />
              <FilesUploaded
                files={incomingFiles}
                onLoadingChange={setUploadLoading}
                onChange={uploadedFiles => setPostFiles(uploadedFiles)}
                onError={setError}
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
            onFileSizeLimit={onFileSizeLimit}
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

export default memo(withSDK(PostCreatorBar));
