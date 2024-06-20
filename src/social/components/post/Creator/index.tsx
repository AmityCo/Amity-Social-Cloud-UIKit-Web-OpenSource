import React, { memo, useState, useEffect, useRef } from 'react';
import cx from 'clsx';
import { FormattedMessage } from 'react-intl';
import {
  UserRepository,
  CommunityRepository,
  FileType,
  PostRepository,
  CommunityPostSettings,
} from '@amityco/ts-sdk';

import useImage from '~/core/hooks/useImage';

import useUser from '~/core/hooks/useUser';
import useErrorNotification from '~/core/hooks/useErrorNotification';

import { backgroundImage as UserImage } from '~/icons/User';
import { backgroundImage as CommunityImage } from '~/icons/Community';
import { useNavigation } from '~/social/providers/NavigationProvider';

import { FileLoaderContainer } from '~/core/components/Uploaders/Loader';
import PollModal from '~/social/components/post/PollComposer/PollModal';
import PostTargetSelector from './components/PostTargetSelector';
import UploaderButtons from './components/UploaderButtons';
import ImagesUploaded from './components/ImagesUploaded';
import VideosUploaded from './components/VideosUploaded';
import FilesUploaded from './components/FilesUploaded';

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
} from './styles';

import { MAXIMUM_POST_CHARACTERS, MAXIMUM_POST_MENTIONEES } from './constants';
import useSDK from '~/core/hooks/useSDK';
import useSocialMention from '~/social/hooks/useSocialMention';
import useCommunityModeratorsCollection from '~/social/hooks/collections/useCommunityModeratorsCollection';
import { ERROR_RESPONSE } from '~/social/constants';
import { useConfirmContext } from '~/core/providers/ConfirmProvider';
import { useNotifications } from '~/core/providers/NotificationProvider';

const useTargetData = ({
  targetId,
  targetType,
}: {
  targetId?: string | null;
  targetType: string;
}) => {
  const [community, setCommunity] = useState<Amity.Community | null>(null);
  const [user, setUser] = useState<Amity.User | null>(null);
  const unsub = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (targetId == null || targetId === '') return;

    if (unsub.current) {
      unsub.current();
    }

    if (targetType === 'communityFeed' || targetType === 'community') {
      unsub.current = CommunityRepository.getCommunity(targetId, (resp) => {
        setCommunity(resp.data);
      });
    }

    unsub.current = UserRepository.getUser(targetId, (resp) => {
      setUser(resp.data);
    });

    return () => {
      unsub.current?.();
    };
  }, [targetId, targetType]);

  return {
    community,
    user,
  };
};

const MAX_FILES_PER_POST = 10;

interface PostCreatorBarProps {
  className?: string;
  targetType: string;
  targetId?: string | null;
  enablePostTargetPicker: boolean;
  communities?: Amity.Community[];
  placeholder?: string;
  hasMoreCommunities?: boolean;
  maxFiles?: number;
  loadMoreCommunities?: () => void;
  onCreateSuccess?: (post: Amity.Post) => void;
}

const PostCreatorBar = ({
  className = '',
  targetType,
  targetId,
  enablePostTargetPicker,
  communities = [],
  placeholder = "What's going on...",
  hasMoreCommunities,
  loadMoreCommunities,
  onCreateSuccess,
  maxFiles = MAX_FILES_PER_POST,
}: PostCreatorBarProps) => {
  const { currentUserId } = useSDK();
  const { setNavigationBlocker } = useNavigation();
  const user = useUser(currentUserId);
  const { info } = useConfirmContext();
  const notification = useNotifications();

  // default to me
  if (targetType === 'global' || targetType === 'myFeed') {
    /* eslint-disable no-param-reassign */
    targetType = 'user';
    /* eslint-disable no-param-reassign */
    targetId = currentUserId || '';
  }

  const [target, setTarget] = useState({ targetType, targetId });
  const { user: targetUser, community } = useTargetData({
    targetId: target.targetId,
    targetType: target.targetType,
  });

  const { moderators } = useCommunityModeratorsCollection(community?.communityId);

  useEffect(() => {
    setTarget({ targetType, targetId });
  }, [targetType, targetId]);

  const avatarFileUrl = useImage({
    fileId: targetUser?.avatarFileId || community?.avatarFileId || '',
  });

  const [postImages, setPostImages] = useState<Amity.File[]>([]);
  const [postVideos, setPostVideos] = useState<Amity.File[]>([]);
  const [postFiles, setPostFiles] = useState<Amity.File[]>([]);

  // Images/files incoming from uploads.
  const [incomingImages, setIncomingImages] = useState<File[]>([]);
  const [incomingVideos, setIncomingVideos] = useState<File[]>([]);
  const [incomingFiles, setIncomingFiles] = useState<File[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [setError] = useErrorNotification();
  const { mentionees, metadata, text, markup, onChange, queryMentionees, clearAll } =
    useSocialMention({
      targetType: target.targetType,
      targetId: target.targetId || undefined,
    });
  const [isCreating, setIsCreating] = useState(false);

  const overCharacterModal = () => {
    info({
      title: <FormattedMessage id="postCreator.unableToPost" />,
      content: <FormattedMessage id="postCreator.overCharacter" />,
      okText: <FormattedMessage id="postCreator.done" />,
      type: 'info',
    });
  };

  async function createPost(createPostParams: Parameters<typeof PostRepository.createPost>[0]) {
    if (!target.targetId) return;
    try {
      setIsCreating(true);

      const postData = await PostRepository.createPost(createPostParams);

      const post = postData.data;

      onCreateSuccess?.(post);
      clearAll();
      setPostImages([]);
      setPostVideos([]);
      setPostFiles([]);
      setIncomingImages([]);
      setIncomingVideos([]);
      setIncomingFiles([]);

      if (community) {
        const isModerator =
          (moderators || []).find((moderator) => moderator.userId === post.postedUserId) != null;
        if (
          community.postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED &&
          !isModerator
        ) {
          notification.success({
            content: <FormattedMessage id="post.success.submittedToReview" />,
          });
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === ERROR_RESPONSE.CONTAIN_BLOCKED_WORD) {
          notification.error({
            content: <FormattedMessage id="notification.error.blockedWord" />,
          });
        }
      }
    } finally {
      setIsCreating(false);
    }
  }

  async function onCreatePost() {
    if (!target.targetId) return;
    const data: { text?: string } = {};
    const attachments = [];

    if (text) {
      data.text = text;
    }

    if (postImages.length) {
      attachments.push(...postImages.map((i) => ({ fileId: i.fileId, type: FileType.IMAGE })));
    }

    if (postVideos.length) {
      attachments.push(...postVideos.map((i) => ({ fileId: i.fileId, type: FileType.VIDEO })));
    }

    if (postFiles.length) {
      attachments.push(...postFiles.map((i) => ({ fileId: i.fileId, type: FileType.FILE })));
    }

    if (data.text?.length && data.text.length > MAXIMUM_POST_CHARACTERS) {
      overCharacterModal();
      return;
    }

    const createPostParams: Parameters<typeof PostRepository.createPost>[0] = {
      targetId: target.targetId,
      targetType: target.targetType,
      data,
      dataType: 'text',
      attachments,
      metadata,
      mentionees,
    };

    return createPost(createPostParams);
  }

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

  const backgroundImage = target.targetType === 'community' ? CommunityImage : UserImage;

  const CurrentTargetAvatar = (
    <Avatar
      avatar={targetUser?.avatarCustomUrl || avatarFileUrl || undefined}
      backgroundImage={backgroundImage}
    />
  );
  const isDisabled =
    (!text && postImages.length === 0 && postVideos.length === 0 && postFiles.length === 0) ||
    uploadLoading ||
    isCreating;
  const hasChanges = !(
    !text &&
    postImages.length === 0 &&
    postVideos.length === 0 &&
    postFiles.length === 0
  );

  useEffect(() => {
    if (hasChanges) {
      setNavigationBlocker?.({
        title: <FormattedMessage id="post.discard.title" />,
        content: <FormattedMessage id="post.discard.content" />,
        okText: <FormattedMessage id="general.action.discard" />,
      });
    } else {
      setNavigationBlocker?.(null);
    }
  }, [hasChanges, setNavigationBlocker]);

  const [isPollModalOpened, setPollModalOpened] = useState(false);
  const openPollModal = () => setPollModalOpened(true);

  const creatorTargetType = target?.targetType ?? targetType;
  const creatorTargetId = target?.targetId ?? targetId;
  return (
    <PostCreatorContainer className={cx('postComposeBar', className)}>
      {isPollModalOpened && (
        <PollModal
          targetId={creatorTargetId || undefined}
          targetType={creatorTargetType}
          onCreatePoll={async (pollId, text, pollMentionees, metadata) => {
            if (!creatorTargetId) return;
            createPost({
              targetId: creatorTargetId,
              targetType: creatorTargetType,
              data: { pollId, text },
              dataType: 'poll',
              mentionees: pollMentionees,
              metadata,
            });
          }}
          onClose={() => setPollModalOpened(false)}
        />
      )}

      {enablePostTargetPicker && user ? (
        <PostTargetSelector
          user={user}
          communities={communities}
          hasMoreCommunities={hasMoreCommunities}
          loadMoreCommunities={loadMoreCommunities}
          currentTargetId={target.targetId}
          onChange={setTarget}
        >
          {CurrentTargetAvatar}
        </PostTargetSelector>
      ) : (
        CurrentTargetAvatar
      )}

      <PostContainer>
        <PostInputText
          data-qa-anchor="post-creator-textarea"
          multiline
          value={markup}
          placeholder={placeholder}
          mentionAllowed
          queryMentionees={queryMentionees}
          loadMoreMentionees={(query) => queryMentionees(query)}
          // Need to work on this, possible conflict incoming
          append={
            <UploadsContainer>
              <ImagesUploaded
                files={incomingImages}
                uploadedFiles={postImages}
                uploadLoading={uploadLoading}
                onLoadingChange={setUploadLoading}
                onChange={({ uploaded, uploading }) => {
                  setPostImages(uploaded);
                  setIncomingImages(uploading);
                }}
                onError={setError}
              />
              <VideosUploaded
                files={incomingVideos}
                uploadedFiles={postVideos}
                uploadLoading={uploadLoading}
                onLoadingChange={setUploadLoading}
                onChange={({ uploaded, uploading }) => {
                  setPostVideos(uploaded);
                  setIncomingVideos(uploading);
                }}
                onError={setError}
              />
              <FilesUploaded
                files={incomingFiles}
                uploadedFiles={postFiles}
                uploadLoading={uploadLoading}
                onLoadingChange={setUploadLoading}
                onChange={({ uploaded, uploading }) => {
                  setPostFiles(uploaded);
                  setIncomingFiles(uploading);
                }}
                onError={setError}
              />
            </UploadsContainer>
          }
          onChange={({ text, plainText: plainTextVal, mentions }) => {
            // Disrupt the flow
            if (mentions?.length > MAXIMUM_POST_MENTIONEES) {
              return info({
                title: <FormattedMessage id="postCreator.unableToMention" />,
                content: <FormattedMessage id="postCreator.overMentionees" />,
                okText: <FormattedMessage id="postCreator.okText" />,
                type: 'info',
              });
            }

            onChange({ text, plainText: plainTextVal, mentions });
          }}
        />
        <Footer data-qa-anchor="post-creator-footer">
          <UploaderButtons
            imageUploadDisabled={postFiles.length > 0 || postVideos.length > 0 || uploadLoading}
            videoUploadDisabled={postFiles.length > 0 || postImages.length > 0 || uploadLoading}
            fileUploadDisabled={postImages.length > 0 || postVideos.length > 0 || uploadLoading}
            fileLimitRemaining={maxFiles - postFiles.length - postImages.length - postVideos.length}
            uploadLoading={uploadLoading}
            onChangeImages={(newImageFiles) => setIncomingImages(newImageFiles)}
            onChangeVideos={setIncomingVideos}
            onChangeFiles={setIncomingFiles}
            onMaxFilesLimit={onMaxFilesLimit}
            onFileSizeLimit={onFileSizeLimit}
          />
          <PollButton data-qa-anchor="post-creator-poll-button" onClick={openPollModal}>
            <FileLoaderContainer>
              <PollIcon />
            </FileLoaderContainer>
          </PollButton>
          <PostButton
            disabled={isDisabled}
            data-qa-anchor="post-creator-post-button"
            onClick={onCreatePost}
          >
            <FormattedMessage id="post" />
          </PostButton>
        </Footer>
      </PostContainer>
    </PostCreatorContainer>
  );
};

export default memo(PostCreatorBar);
