import React, { useCallback, useEffect, useState } from 'react';
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
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { VideoPreview } from '~/v4/social/internal-components/VideoPreview';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import ColorThief from 'colorthief';

import styles from './DraftsPage.module.css';

export type AmityStoryMediaType = { type: 'image'; url: string } | { type: 'video'; url: string };

export type AmityDraftStoryPageProps = {
  targetId: string;
  targetType: Amity.StoryTargetType;
  mediaType?: AmityStoryMediaType;
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
}: AmityDraftStoryPageProps & {
  goToCommunityPage: (communityId: string) => void;
  goToGlobalFeedPage: () => void;
  onDiscardCreateStory: () => void;
}) => {
  const { page } = useNavigation();
  const pageId = 'create_story_page';
  const { accessibilityId, themeStyles } = useAmityPage({
    pageId,
  });

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

  const [imageMode, setImageMode] = useState<'fit' | 'fill'>('fit');
  const [colors, setColors] = useState<string[]>([]);

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
      if (page.type === PageTypes.DraftPage && page.context.storyType === 'globalFeed') {
        goToGlobalFeedPage();
      } else {
        goToCommunityPage(targetId);
      }
      if (mediaType?.type === 'image' && targetId) {
        await StoryRepository.createImageStory(
          targetType,
          targetId,
          formData,
          metadata,
          imageMode,
          items,
        );
      } else if (mediaType?.type === 'video' && targetId) {
        await StoryRepository.createVideoStory(targetType, targetId, formData, metadata, items);
      }
      notification.success({
        content: 'Successfully shared story',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        notification.info({
          content: error.message ?? 'Failed to share story',
        });
      }
    }
  };

  const discardCreateStory = () => {
    confirm({
      pageId,
      title: 'Delete this story?',
      content:
        'This story will be permanently deleted. You’ll no longer to see and find this story.',
      cancelText: 'Cancel',
      okText: 'Delete',
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
        content: 'Can’t add more than one link to your story.',
      });
      return;
    }
    setIsHyperLinkBottomSheetOpen(true);
  };

  const extractColorsFromImage = useCallback(async (imageUrl: string) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(img, 2);
      if (palette) {
        setColors(palette.map((color) => `rgb(${color.join(',')})`));
      }
    };
  }, []);

  useEffect(() => {
    const extractColors = async () => {
      if (mediaType?.type === 'image') {
        if (file) {
          const imageUrl = URL.createObjectURL(file);
          await extractColorsFromImage(imageUrl);
        } else if (mediaType.url) {
          await extractColorsFromImage(mediaType.url);
        }
      }
    };

    extractColors();
  }, [file, mediaType, extractColorsFromImage]);

  return (
    <div data-qa-anchor={accessibilityId} style={themeStyles} className={styles.storyWrapper}>
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
                ${colors[0] || 'var(--asc-color-black)'} 0%,
                ${colors[1] || 'var(--asc-color-black)'} 100%
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
              onLoad={(e) => {
                if (imageMode === 'fill') {
                  extractColorsFromImage((e.target as HTMLImageElement).src);
                }
              }}
            />
          </div>
        ) : mediaType?.type === 'video' ? (
          <video
            className={styles.videoPreview}
            src={file ? URL.createObjectURL(file) : mediaType.url}
            autoPlay
            loop
            muted
            controls={false}
            playsInline
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
  const { AmityDraftStoryPageBehavior } = usePageBehavior();

  return (
    <PlainDraftStoryPage
      {...props}
      onDiscardCreateStory={() => AmityDraftStoryPageBehavior?.onCloseAction?.()}
      goToCommunityPage={(communityId) => AmityDraftStoryPageBehavior?.onCloseAction?.()}
      goToGlobalFeedPage={() => AmityDraftStoryPageBehavior?.onCloseAction?.()}
    />
  );
};

export default AmityDraftStoryPage;
