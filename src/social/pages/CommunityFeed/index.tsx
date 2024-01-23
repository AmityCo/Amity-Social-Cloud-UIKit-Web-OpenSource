import React, { useEffect, useState, useMemo } from 'react';

import { StoryRepository, SubscriptionLevels } from '@amityco/ts-sdk';
import { FormattedMessage } from 'react-intl';
import CommunityCreatedModal from '~/social/components/CommunityCreatedModal';

import useCommunity from '~/social/hooks/useCommunity';

import Feed from '~/social/components/Feed';
import MediaGallery from '~/social/components/MediaGallery';
import CommunityInfo from '~/social/components/CommunityInfo';
import CommunityMembers from '~/social/components/CommunityMembers';
import FeedHeaderTabs from '~/social/components/FeedHeaderTabs';
import { CommunityFeedTabs } from './constants';
import { getTabs } from './utils';
import { DeclineBanner, Wrapper } from './styles';
import useCommunityPermission from '~/social/hooks/useCommunityPermission';
import useCommunitySubscription from '~/social/hooks/useCommunitySubscription';

import usePostsCollection from '~/social/hooks/collections/usePostsCollection';
import { StoryDraft } from '~/V4/social/components/StoryDraft';
import useFile from '~/core/hooks/useFile';
import { notification } from '~/core/components/Notification';
import { HeadTitle, MobileContainer } from '../NewsFeed/styles';
import { BarsIcon } from '~/V4/icons';

interface CommunityFeedProps {
  communityId: string;
  isNewCommunity: boolean;
  toggleOpen: () => void;
}

const CommunityFeed = ({ communityId, isNewCommunity, toggleOpen }: CommunityFeedProps) => {
  const community = useCommunity(communityId);

  const communityAvatar = useFile(community?.avatarFileId || '');

  const { canReview } = useCommunityPermission({ community });

  const [uploading, setUploading] = useState(false);

  const { posts } = usePostsCollection({
    targetId: communityId,
    targetType: 'community',
    feedType: 'reviewing',
  });

  const pendingPostCount = posts.reduce((acc, post) => acc + post.flagCount, 0);

  const tabs = useMemo(
    () => getTabs(community?.postSetting, community?.isJoined, canReview, pendingPostCount),
    [community?.postSetting, community?.isJoined, canReview, pendingPostCount],
  );

  const [activeTab, setActiveTab] = useState(CommunityFeedTabs.TIMELINE);

  useCommunitySubscription({
    communityId,
    level: SubscriptionLevels.POST,
  });

  useEffect(() => {
    if (!tabs.find((tab) => tab.value === activeTab)) {
      setActiveTab(tabs[0].value);
    }
  }, [activeTab, tabs]);

  const isJoined = community?.isJoined || false;

  const [isCreatedModalOpened, setCreatedModalOpened] = useState(isNewCommunity);

  const [storyFile, setStoryFile] = useState<File | null>(null);

  const createStory = async (file: File, imageMode: 'fit' | 'fill', metadata = {}, items = []) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('files', file);
      if (file?.type.includes('image')) {
        setStoryFile(null);
        const { data: imageData } = await StoryRepository.createImageStory(
          'community',
          communityId,
          formData,
          metadata,
          imageMode,
          items,
        );
        if (imageData) {
          notification.success({
            content: <FormattedMessage id="storyViewer.notification.success" />,
          });
        }
      } else {
        setStoryFile(null);
        const { data: videoData } = await StoryRepository.createVideoStory(
          'community',
          communityId,
          formData,
          metadata,
          items,
        );
        if (videoData) {
          notification.success({
            content: <FormattedMessage id="storyViewer.notification.success" />,
          });
        }
      }
    } catch (error) {
      notification.info({
        content: <FormattedMessage id="storyViewer.notification.error" />,
      });
    } finally {
      setUploading(false);
    }
  };

  if (storyFile) {
    return (
      <Wrapper>
        <StoryDraft
          file={storyFile}
          targetId={communityId}
          creatorAvatar={communityAvatar?.fileUrl || ''}
          onCreateStory={createStory}
          onDiscardStory={() => setStoryFile(null)}
          setUploading={setUploading}
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <MobileContainer>
        <BarsIcon onClick={toggleOpen} />
        <HeadTitle>
          <FormattedMessage id="sidebar.community" />
        </HeadTitle>
      </MobileContainer>
      <CommunityInfo
        communityId={communityId}
        setStoryFile={setStoryFile}
        uploadingStory={uploading}
      />
      <FeedHeaderTabs
        data-qa-anchor="community-feed-header"
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === CommunityFeedTabs.TIMELINE && (
        <Feed
          targetType={'community'}
          targetId={communityId}
          readonly={!isJoined}
          showPostCreator={isJoined}
          feedType={'published'}
        />
      )}

      {activeTab === CommunityFeedTabs.GALLERY && (
        <MediaGallery targetType={'community'} targetId={communityId} />
      )}

      {activeTab === CommunityFeedTabs.MEMBERS && <CommunityMembers communityId={communityId} />}

      {activeTab === CommunityFeedTabs.PENDING && (
        <>
          {canReview && (
            <DeclineBanner>
              <FormattedMessage id="community.review.declinePendingPosts" />
            </DeclineBanner>
          )}
          <Feed
            targetType={'community'}
            targetId={communityId}
            readonly={!isJoined}
            showPostCreator={false}
            feedType={'reviewing'}
          />
        </>
      )}

      {isCreatedModalOpened && (
        <CommunityCreatedModal
          communityId={communityId}
          onClose={() => setCreatedModalOpened(false)}
        />
      )}
    </Wrapper>
  );
};

export default CommunityFeed;
