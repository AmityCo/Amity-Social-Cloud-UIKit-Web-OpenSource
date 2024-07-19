import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { extractColors } from 'extract-colors';
import { readFileAsync } from '~/helpers';
import { SubmitHandler } from 'react-hook-form';
import {
  AspectRatioButton,
  BackButton,
  HyperLinkButton,
  ShareStoryButton,
  HyperLink,
} from '~/v4/social/elements';
import { useStoryContext } from '~/v4/social/providers/StoryProvider';
import { StoryRepository } from '@amityco/ts-sdk';
import { HyperLinkConfig } from '~/v4/social/components';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useCommunityInfo } from '~/social/components/CommunityInfo/hooks';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';

import styles from './DraftsPage.module.css';
import { VideoPreview } from '~/v4/social/internal-components/VideoPreview';

export type AmityStoryMediaType = { type: 'image'; url: string } | { type: 'video'; url: string };

export type AmityDraftStoryPageProps = {
  targetId: string;
  targetType: Amity.StoryTargetType;
  mediaType?: AmityStoryMediaType;
  storyType: 'communityFeed' | 'globalFeed';
};

export type HyperLinkFormInputs = {
  url: string;
  customText?: string;
};

export const PlainDraftStoryPage = ({
  targetId,
  targetType,
  mediaType,
  goToCommunityPage,
  goToGlobalFeedPage,
  onDiscardCreateStory,
  storyType,
}: AmityDraftStoryPageProps & {
  goToCommunityPage: (communityId: string) => void;
  goToGlobalFeedPage: () => void;
  onDiscardCreateStory: () => void;
  storyType: 'communityFeed' | 'globalFeed';
}) => {
  const pageId = 'create_story_page';
  const { file, setFile } = useStoryContext();
  const { community } = useCommunityInfo(targetId);
  const [isHyperLinkBottomSheetOpen, setIsHyperLinkBottomSheetOpen] = useState(false);
  const { confirm } = useConfirmContext();
  const notification = useNotifications();

  const [hyperLink, setHyperLink] = useState<
    {
      data: { url: string; customText: string };
      type: Amity.StoryItemType;
    }[]
  >([
    {
      data: {
        url: '',
        customText: '',
      },
      type: 'hyperlink' as Amity.StoryItemType,
    },
  ]);

  const handleHyperLinkBottomSheetClose = () => {
    setIsHyperLinkBottomSheetOpen(false);
  };

  const { formatMessage } = useIntl();

  const [imageMode, setImageMode] = useState<'fit' | 'fill'>('fit');
  const [colors, setColors] = useState<Awaited<ReturnType<typeof extractColors>>>([]);

  const onClickImageMode = () => {
    setImageMode(imageMode === 'fit' ? 'fill' : 'fit');
    if (imageMode === 'fill') {
      setColors([]);
    }
  };

  const onCreateStory = async (
    file: File | null,
    imageMode: 'fit' | 'fill',
    metadata?: Amity.Metadata,
    items?: Amity.StoryItem[],
  ) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('files', file);
      setFile(null);
      if (storyType === 'globalFeed') {
        goToGlobalFeedPage();
      } else {
        goToCommunityPage(targetId);
      }
      if (mediaType?.type === 'image' && targetId) {
        const { data: imageData } = await StoryRepository.createImageStory(
          targetType,
          targetId,
          formData,
          metadata,
          imageMode,
          items,
        );
        if (imageData) {
          notification.success({
            content: formatMessage({ id: 'storyViewer.notification.success' }),
          });
        }
      } else if (mediaType?.type === 'video' && targetId) {
        const { data: videoData } = await StoryRepository.createVideoStory(
          targetType,
          targetId,
          formData,
          metadata,
          items,
        );
        if (videoData) {
          notification.success({
            content: formatMessage({ id: 'storyViewer.notification.success' }),
          });
        }
      }
    } catch (error) {
      notification.error({
        content: formatMessage({ id: 'storyViewer.notification.error' }),
      });
    }
  };

  const discardCreateStory = () => {
    confirm({
      title: formatMessage({ id: 'storyViewer.action.confirmModal.title' }),
      content: formatMessage({ id: 'storyViewer.action.confirmModal.content' }),
      cancelText: formatMessage({ id: 'general.action.cancel' }),
      okText: formatMessage({ id: 'delete' }),
      onOk: () => {
        setFile(null);
        onDiscardCreateStory();
      },
    });
  };

  const onSubmitHyperLink: SubmitHandler<HyperLinkFormInputs> = ({ url, customText }) => {
    setHyperLink([
      {
        data: {
          url,
          customText: customText || '',
        },
        // TODO: fix type
        type: 'hyperlink' as Amity.StoryItemType,
      },
    ]);
    setIsHyperLinkBottomSheetOpen(false);
  };

  const onRemoveHyperLink = () => {
    setHyperLink([
      {
        data: {
          url: '',
          customText: '',
        },
        type: 'hyperlink' as Amity.StoryItemType,
      },
    ]);
  };

  const handleOnClickHyperLinkActionButton = () => {
    if (hyperLink[0]?.data?.url) {
      notification.info({
        content: formatMessage({ id: 'storyDraft.notification.hyperlink.error' }),
      });
      return;
    }
    setIsHyperLinkBottomSheetOpen(true);
  };

  useEffect(() => {
    const extractColorsFromImage = async (fileTarget: File) => {
      const img = await readFileAsync(fileTarget);

      if (fileTarget?.type.includes('image')) {
        const image = new Image();
        image.src = img as string;

        const colorsFromImage = await extractColors(image, {
          crossOrigin: 'anonymous',
        });

        setColors(colorsFromImage);
      }
    };

    if (mediaType?.type === 'image') {
      if (file) {
        extractColorsFromImage(file);
      } else if (mediaType.url) {
        fetch(mediaType.url)
          .then((response) => response.blob())
          .then((blob) => {
            const fileFromUrl = new File([blob], 'image', { type: 'image/jpeg' });
            extractColorsFromImage(fileFromUrl);
          });
      }
    }
  }, [file, imageMode, mediaType]);

  return (
    <div className={styles.storyWrapper}>
      <div id="asc-uikit-create-story" className={styles.draftPageContainer}>
        <div className={styles.headerContainer}>
          <div className={styles.header}>
            <BackButton pageId={pageId} onPress={discardCreateStory} />
            <div className={styles.topRightButtons}>
              {mediaType?.type === 'image' && (
                <AspectRatioButton pageId={pageId} onPress={onClickImageMode} />
              )}
              <HyperLinkButton pageId={pageId} onPress={handleOnClickHyperLinkActionButton} />
            </div>
          </div>
        </div>

        {mediaType?.type === 'image' ? (
          <div
            className={styles.mainContainer}
            style={{
              background: `linear-gradient(
              180deg,
              ${colors?.length > 0 ? colors[0].hex : 'var(--asc-color-black)'} 0%,
              ${colors?.length > 0 ? colors[colors?.length - 1].hex : 'var(--asc-color-black)'} 100%
            )`,
            }}
          >
            <img
              className={styles.previewImage}
              src={file ? URL.createObjectURL(file) : mediaType.url}
              style={{
                width: '100%',
                height: '100%',
                objectFit: imageMode === 'fit' ? 'contain' : 'cover',
              }}
              alt="Draft"
            />
          </div>
        ) : mediaType?.type === 'video' ? (
          <VideoPreview
            mediaFit="contain"
            className={styles.videoPreview}
            src={file ? URL.createObjectURL(file) : mediaType.url}
            autoPlay
            loop
            controls={false}
          />
        ) : null}
        {hyperLink[0]?.data?.url && (
          <div className={styles.hyperLinkContainer}>
            <HyperLink onClick={() => setIsHyperLinkBottomSheetOpen(true)}>
              {hyperLink[0]?.data?.customText || hyperLink[0].data.url.replace(/^https?:\/\//, '')}
            </HyperLink>
          </div>
        )}

        <HyperLinkConfig
          pageId={pageId}
          isOpen={isHyperLinkBottomSheetOpen}
          onClose={handleHyperLinkBottomSheetClose}
          onSubmit={onSubmitHyperLink}
          onRemove={onRemoveHyperLink}
          isHaveHyperLink={hyperLink?.[0]?.data?.url !== ''}
        />

        <div className={styles.footer}>
          <ShareStoryButton
            community={community}
            pageId={pageId}
            onClick={() =>
              onCreateStory(file, imageMode, {}, hyperLink[0]?.data?.url ? hyperLink : [])
            }
          />
        </div>
      </div>
    </div>
  );
};

export const AmityDraftStoryPage = (props: AmityDraftStoryPageProps) => {
  const { page } = useNavigation();
  const { AmityDraftStoryPageBehavior } = usePageBehavior();

  return (
    <PlainDraftStoryPage
      {...props}
      onDiscardCreateStory={() => AmityDraftStoryPageBehavior.onCloseAction()}
      goToCommunityPage={(communityId) => AmityDraftStoryPageBehavior.onCloseAction()}
      goToGlobalFeedPage={() => AmityDraftStoryPageBehavior.onCloseAction()}
      storyType={page.type === 'communityFeed' ? 'communityFeed' : 'globalFeed'}
    />
  );
};

export default AmityDraftStoryPage;
