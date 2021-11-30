import React, { memo, useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import {
  UserRepository,
  CommunityRepository,
  PostTargetType,
  FileRepository,
  FileType,
  ImageSize,
} from '@amityco/js-sdk';

import { info } from '~/core/components/Confirm';
import { useAsyncCallback } from '~/core/hooks/useAsyncCallback';

import { isEmpty } from '~/helpers';
import withSDK from '~/core/hocs/withSDK';
import useUser from '~/core/hooks/useUser';
import useLiveObject from '~/core/hooks/useLiveObject';
import useErrorNotification from '~/core/hooks/useErrorNotification';
import { notification } from '~/core/components/Notification';
import ConditionalRender from '~/core/components/ConditionalRender';

import { backgroundImage as UserImage } from '~/icons/User';
import { backgroundImage as CommunityImage } from '~/icons/Community';
import { useNavigation } from '~/social/providers/NavigationProvider';

import PostTargetSelector from './components/PostTargetSelector';
import UploaderButtons from './components/UploaderButtons';
import ImagesUploaded from './components/ImagesUploaded';
import VideosUploaded from './components/VideosUploaded';
import FilesUploaded from './components/FilesUploaded';

import { formatMentionees } from '../../../../helpers/utils';

import { createPost, showPostCreatedNotification } from './utils';
import {
  Avatar,
  PostCreatorContainer,
  Footer,
  PostContainer,
  PostButton,
  UploadsContainer,
  PostInputText,
  PollButton,
  PollIcon,
  PollIconContainer,
} from './styles';
import PollModal from '~/social/components/post/PollComposer/PollModal';
import { MAXIMUM_POST_CHARACTERS, MAXIMUM_POST_MENTIONEES } from './constants';

const communityFetcher = id => () => CommunityRepository.communityForId(id);
const userFetcher = id => () => new UserRepository().userForId(id);

const mentioneeCommunityFetcher = (communityId, search) =>
  CommunityRepository.getCommunityMembers({
    communityId,
    search,
  });

const MAX_FILES_PER_POST = 10;

const overCharacterModal = () =>
  info({
    title: <FormattedMessage id="postCreator.unableToPost" />,
    content: <FormattedMessage id="postCreator.overCharacter" />,
    okText: <FormattedMessage id="postCreator.done" />,
    type: 'info',
  });

const PostCreatorBar = ({
  className = '',
  currentUserId,
  connected, // connection status
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
  const { setNavigationBlocker } = useNavigation();
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
  const [postVideos, setPostVideos] = useState([]);
  const [postFiles, setPostFiles] = useState([]);

  // Images/files incoming from uploads.
  const [incomingImages, setIncomingImages] = useState([]);
  const [incomingVideos, setIncomingVideos] = useState([]);
  const [incomingFiles, setIncomingFiles] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [setError] = useErrorNotification();
  const [mentionees, setMentionees] = useState([]);

  const [onCreatePost, creating] = useAsyncCallback(async () => {
    const data = {};
    const attachments = [];
    const postMentionees = {};

    if (postText) {
      // parse text and remove extra markup
      // entities created by react-mentions
      const formattedText = postText.replace(/@\(\w*\)/g, matched => {
        const middleText = matched.match(/\(([^)]+)\)/)?.[1];
        return `@${middleText}`;
      });
      data.text = formattedText;
    }
    if (postImages.length) {
      attachments.push(...postImages.map(i => ({ fileId: i.fileId, type: FileType.Image })));
    }
    if (postVideos.length) {
      attachments.push(...postVideos.map(i => ({ fileId: i.fileId, type: FileType.Video })));
    }
    if (postFiles.length) {
      attachments.push(...postFiles.map(i => ({ fileId: i.fileId, type: FileType.File })));
    }

    if (mentionees.length) {
      postMentionees.type = 'user';
      postMentionees.userIds = mentionees.map(({ id }) => id);
    }

    if (data.text?.length > MAXIMUM_POST_CHARACTERS) {
      overCharacterModal();
      return;
    }

    const createPostParams = {
      ...target,
      data,
      attachments,
    };

    if (postMentionees.type && postMentionees.userIds.length > 0) {
      createPostParams.mentionees = [{ ...postMentionees }];
    }

    const post = await createPost(createPostParams);

    onCreateSuccess(post.postId);
    setPostText('');
    setPostImages([]);
    setPostVideos([]);
    setPostFiles([]);
    setIncomingImages([]);
    setIncomingVideos([]);
    setIncomingFiles([]);
    setMentionees([]);

    showPostCreatedNotification(post, model);
  }, [postText, postImages, postVideos, postFiles, target, onCreateSuccess, model, mentionees]);

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
  const isDisabled =
    isEmpty(postText, postImages, postVideos, postFiles) || uploadLoading || creating || !connected;
  const hasChanges = !isEmpty(postText, postImages, postVideos, postFiles);

  useEffect(() => {
    if (hasChanges) {
      setNavigationBlocker({
        title: <FormattedMessage id="post.discard.title" />,
        content: <FormattedMessage id="post.discard.content" />,
        okText: <FormattedMessage id="general.action.discard" />,
      });
    } else {
      setNavigationBlocker(null);
    }
  }, [hasChanges]);

  const [isPollModalOpened, setPollModalOpened] = useState(false);
  const openPollModal = () => setPollModalOpened(true);

  const [mentionText, setMentionText] = useState();

  const queryMentionees = useCallback(
    (query, cb) => {
      let keyword = query || mentionText;
      let liveCollection;

      // Weird hack to show users to show users on start
      if (keyword.match(/^@$/)) {
        keyword = undefined;
      }

      // Only fetch private community members
      if (targetType === PostTargetType.CommunityFeed && !model?.isPublic) {
        liveCollection = mentioneeCommunityFetcher(targetId, keyword);
      } else {
        liveCollection = UserRepository.queryUsers({ keyword });
      }

      liveCollection.on('dataUpdated', models => {
        cb(formatMentionees(models));
      });
    },
    [mentionText],
  );

  return (
    <PostCreatorContainer className={cx('postComposeBar', className)}>
      <PollModal
        isOpen={isPollModalOpened}
        onCreatePoll={(pollId, text) =>
          createPost({
            targetType,
            targetId,
            data: { pollId, text },
            dataType: 'poll',
          })
        }
        onClose={() => setPollModalOpened(false)}
      />

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
          data-qa-anchor="social-create-post-input"
          multiline
          value={postText}
          onChange={({ text, lastMentionText, mentions }) => {
            // Disrupt the flow
            if (mentions?.length > MAXIMUM_POST_MENTIONEES) {
              return info({
                title: <FormattedMessage id="postCreator.unableToMention" />,
                content: <FormattedMessage id="postCreator.overMentionees" />,
                okText: <FormattedMessage id="postCreator.okText" />,
                type: 'info',
              });
            }

            setMentionees(mentions);
            setMentionText(lastMentionText);
            setPostText(text);
          }}
          placeholder={placeholder}
          mentionAllowed
          queryMentionees={queryMentionees}
          // Need to work on this, possible conflict incoming
          loadMoreMentionees={() => queryMentionees(mentionText)}
          append={
            <UploadsContainer>
              <ImagesUploaded
                files={incomingImages}
                onLoadingChange={setUploadLoading}
                onChange={uploadedImages => setPostImages(uploadedImages)}
                onError={setError}
                uploadLoading={uploadLoading}
              />
              <VideosUploaded
                files={incomingVideos}
                onLoadingChange={setUploadLoading}
                onChange={uploadedVideos => setPostVideos(uploadedVideos)}
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
            imageUploadDisabled={postFiles.length > 0 || postVideos.length > 0 || uploadLoading}
            videoUploadDisabled={postFiles.length > 0 || postImages.length > 0 || uploadLoading}
            fileUploadDisabled={postImages.length > 0 || postVideos.length > 0 || uploadLoading}
            onChangeImages={newImages => setIncomingImages(newImages)}
            onChangeVideos={newVideos => setIncomingVideos(newVideos)}
            onChangeFiles={newFiles => setIncomingFiles(newFiles)}
            onMaxFilesLimit={onMaxFilesLimit}
            onFileSizeLimit={onFileSizeLimit}
            fileLimitRemaining={maxFiles - postFiles.length - postImages.length - postVideos.length}
            uploadLoading={uploadLoading}
          />
          <PollButton onClick={openPollModal}>
            <PollIconContainer>
              <PollIcon />
            </PollIconContainer>
          </PollButton>
          <PostButton
            disabled={isDisabled}
            onClick={onCreatePost}
            data-qa-anchor="social-create-post-button"
          >
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
  connected: PropTypes.bool,
};

export default memo(withSDK(PostCreatorBar));
