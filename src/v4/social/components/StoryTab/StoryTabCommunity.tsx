import React from 'react';
import { useString } from '~/v4/core/localization';
import Truncate from 'react-truncate-markup';
import { FileTrigger } from 'react-aria-components';
import { StoryRing } from '~/v4/social/elements/StoryRing/StoryRing';
import clsx from 'clsx';
import { useGetActiveStoriesByTarget } from '~/v4/social/hooks/useGetActiveStories';
import { useCommunityInfo } from '~/v4/social/hooks/useCommunityInfo';
import { CreateNewStoryButton } from '~/v4/social/elements/CreateNewStoryButton';
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useStoryPermission } from '~/v4/social/hooks/useStoryPermission';
import styles from './StoryTabCommunity.module.css';
import { Typography } from '~/v4/core/components';
import { canCreatePostCommunity } from '~/v4/social/utils';
import useSDK from '~/v4/core/hooks/useSDK';
import { ErrorBadge } from '~/v4/icons/ErrorBadge';

interface StoryTabCommunityFeedProps {
  pageId?: string;
  componentId?: string;
  communityId: string;
  onStoryClick: () => void;
  onFileChange: (file: File | null) => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

export const StoryTabCommunityFeed: React.FC<StoryTabCommunityFeedProps> = ({
  pageId = '*',
  componentId = '*',
  communityId,
  onFileChange,
  onStoryClick,
  onLoadingChange,
}) => {
  const { client } = useSDK();
  const { community } = useCommunityInfo(communityId);
  const { hasStoryPermission } = useStoryPermission(communityId);
  const { isExcluded, accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });
  const { stories, isLoading } = useGetActiveStoriesByTarget({
    targetId: communityId,
    targetType: 'community',
    options: { orderBy: 'asc', sortBy: 'createdAt' },
  });

  React.useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading]);

  const hasStories = stories?.length > 0;
  const storiesWithoutAds = stories.filter((story) => !(story as Amity.Ad).adId) as Amity.Story[];
  const hasUnSeen = storiesWithoutAds.some((story) => !story?.isSeen);
  const uploading = storiesWithoutAds.some((story) => story?.syncState === 'syncing');
  const isErrored = storiesWithoutAds.some((story) => story?.syncState === 'error');

  const handleOnClick = () => {
    if (Array.isArray(stories) && stories.length === 0) return;
    onStoryClick();
  };

  if (isExcluded) return null;

  if (
    (!hasStories && !hasStoryPermission) ||
    // if community has setting to only allow admin to post
    (community && !canCreatePostCommunity(client, community)) ||
    (community?.isPublic && !community.isJoined && !hasStories)
  )
    return null;

  return (
    <div
      data-testid={accessibilityId}
      style={themeStyles}
      className={clsx(styles.storyTabContainer)}
    >
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

        <button className={clsx(styles.storyAvatarContainer)} onClick={handleOnClick}>
          <CommunityAvatar pageId={pageId} componentId={componentId} community={community} />
        </button>

        {community?.isJoined &&
          hasStoryPermission &&
          community &&
          canCreatePostCommunity(client, community) && (
            <FileTrigger
              onSelect={(e) => {
                const files = Array.from(e as FileList);
                onFileChange(files[0]);
              }}
            >
              <CreateNewStoryButton pageId={pageId} componentId={componentId} />
            </FileTrigger>
          )}
        {isErrored && <ErrorBadge className={clsx(styles.errorIcon)} />}
      </div>
      <Typography.Caption data-testid={`${pageId}/${componentId}/story_title`}>
        {useString('amity_social_button_story')}
      </Typography.Caption>
    </div>
  );
};
