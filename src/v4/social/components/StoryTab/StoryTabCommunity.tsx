import React, { useRef } from 'react';
import Truncate from 'react-truncate-markup';

import useStories from '~/social/hooks/useStories';
import useSDK from '~/core/hooks/useSDK';

import { FormattedMessage } from 'react-intl';
import { StoryRing } from '~/v4/social/elements/StoryRing/StoryRing';
import clsx from 'clsx';

import styles from './StoryTabCommunity.module.css';
import useUser from '~/v4/core/hooks/objects/useUser';
import { useCommunityInfo } from '~/social/components/CommunityInfo/hooks';
import { isAdmin, isModerator } from '~/v4/utils/permissions';
import { checkStoryPermission } from '~/v4/social/utils';
import { Avatar } from '~/v4/core/components';
import { AVATAR_SIZE } from '~/v4/core/components/Avatar';
import CommunityDefaultImg from '~/v4/icons/Community';

const AddIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <circle cx="8" cy="8" r="7.25" fill="#1054DE" stroke="#fff" strokeWidth="1.5"></circle>
      <path
        fill="#fff"
        d="M11.438 7.625c.156 0 .312.156.312.313v.625a.321.321 0 01-.313.312H8.626v2.813a.321.321 0 01-.313.312h-.624a.308.308 0 01-.313-.313V8.876H4.562a.309.309 0 01-.312-.313v-.624c0-.157.137-.313.313-.313h2.812V4.812c0-.156.137-.312.313-.312h.625c.156 0 .312.156.312.313v2.812h2.813z"
      ></path>
    </svg>
  );
};
const ErrorIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <circle cx="8" cy="8" r="7.25" fill="#FA4D30" stroke="#fff" strokeWidth="1.5"></circle>
      <path
        fill="#fff"
        d="M9.25 10.75C9.25 11.453 8.687 12 8 12c-.703 0-1.25-.547-1.25-1.25 0-.688.547-1.25 1.25-1.25.688 0 1.25.563 1.25 1.25zM6.89 4.406A.378.378 0 017.267 4h1.453c.219 0 .39.188.375.406l-.203 4.25A.387.387 0 018.516 9H7.469a.387.387 0 01-.375-.344l-.203-4.25z"
      ></path>
    </svg>
  );
};

interface StoryTabCommunityFeedProps {
  pageId: string;
  componentId: string;
  communityId: string;
  onStoryClick: () => void;
  onFileChange: (file: File | null) => void;
}

export const StoryTabCommunityFeed: React.FC<StoryTabCommunityFeedProps> = ({
  pageId,
  componentId,
  communityId,
  onFileChange,
  onStoryClick,
}) => {
  const { stories } = useStories({
    targetId: communityId,
    targetType: 'community',
    options: { orderBy: 'asc', sortBy: 'createdAt' },
  });
  const { avatarFileUrl, community } = useCommunityInfo(communityId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { currentUserId, client } = useSDK();
  const { user } = useUser(currentUserId);
  const isGlobalAdmin = isAdmin(user?.roles);
  const isCommunityModerator = isModerator(user?.roles);
  const hasStoryPermission =
    isGlobalAdmin || isCommunityModerator || checkStoryPermission(client, communityId);
  const hasStories = stories?.length > 0;
  const hasUnSeen = stories.some((story) => !story?.isSeen);
  const uploading = stories.some((story) => story?.syncState === 'syncing');
  const isErrored = stories.some((story) => story?.syncState === 'error');

  const handleAddIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const handleOnClick = () => {
    if (Array.isArray(stories) && stories.length === 0) return;
    onStoryClick();
  };

  if (!community?.isJoined && !hasStories) return null;

  return (
    <div className={clsx(styles.storyTabContainer)}>
      <div className={clsx(styles.storyWrapper)}>
        {hasStories && (
          <StoryRing
            pageId={pageId}
            componentId={componentId}
            hasUnseen={hasUnSeen}
            uploading={uploading}
            isErrored={isErrored}
            size={48}
          />
        )}

        <div className={clsx(styles.storyAvatarContainer)}>
          <Avatar
            avatar={avatarFileUrl}
            size={AVATAR_SIZE.SMALL}
            className={clsx(styles.storyAvatar)}
            onClick={handleOnClick}
            defaultImage={<CommunityDefaultImg />}
          />
        </div>

        {hasStoryPermission && (
          <>
            <AddIcon className={styles.addStoryButton} onClick={handleAddIconClick} />
            <input
              className={clsx(styles.hiddenInput)}
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </>
        )}
        {isErrored && <ErrorIcon className={clsx(styles.errorIcon)} />}
      </div>
      <Truncate lines={1}>
        <div className={clsx(styles.storyTitle)}>
          <FormattedMessage id="storyTab.title" />
        </div>
      </Truncate>
    </div>
  );
};
