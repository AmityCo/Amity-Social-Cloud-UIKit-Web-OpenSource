import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { extractColors } from 'extract-colors';
import { readFileAsync } from '~/helpers';

import styles from './DraftsPage.module.css';
import { SubmitHandler } from 'react-hook-form';

import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
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
import { useNavigation } from '~/social/providers/NavigationProvider';
import { PageTypes } from '~/social/constants';
import { BaseVideoPreview } from '../../internal-components/VideoPreview';
import { useCommunityInfo } from '~/social/components/CommunityInfo/hooks';

type AmityStoryMediaType = { type: 'image'; url: string } | { type: 'video'; url: string };

type AmityDraftStoryPageProps = {
  targetId?: string;
  targetType: Amity.StoryTargetType;
  mediaType?: AmityStoryMediaType;
};

type HyperLinkFormInputs = {
  url: string;
  customText?: string;
};

const AmityDraftStoryPage = ({ targetId, targetType, mediaType }: AmityDraftStoryPageProps) => {
  const { page, onChangePage, onClickCommunity } = useNavigation();
  const { file, setFile } = useStoryContext();
  const { AmityDraftStoryPageBehavior } = usePageBehavior();
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

  const community = useCommunityInfo(targetId);

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
      if (page.type === PageTypes.ViewStory && page.storyType === 'globalFeed') {
        onChangePage(PageTypes.NewsFeed);
      } else {
        if (page.communityId) {
          onClickCommunity(page.communityId);
        }
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
        AmityDraftStoryPageBehavior.onCloseAction();
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
    <>
      <div id="asc-uikit-create-story" className={styles.draftPage}>
        <div className={styles.headerContainer}>
          <div className={styles.header}>
            <BackButton pageId="create_story_page" componentId="*" onClick={discardCreateStory} />
            <div className={styles.topRightButtons}>
              {mediaType?.type === 'image' && (
                <AspectRatioButton
                  pageId="create_story_page"
                  componentId="*"
                  onClick={onClickImageMode}
                />
              )}
              <HyperLinkButton
                pageId="create_story_page"
                componentId="*"
                onClick={handleOnClickHyperLinkActionButton}
              />
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
          <BaseVideoPreview
            className={styles.videoPreview}
            src={file ? URL.createObjectURL(file) : mediaType.url}
            mediaFit="contain"
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
          pageId="*"
          isOpen={isHyperLinkBottomSheetOpen}
          onClose={handleHyperLinkBottomSheetClose}
          onSubmit={onSubmitHyperLink}
          onRemove={onRemoveHyperLink}
          isHaveHyperLink={hyperLink?.[0]?.data?.url !== ''}
        />

        <div className={styles.footer}>
          <ShareStoryButton
            pageId="create_story_page"
            componentId="*"
            onClick={() =>
              onCreateStory(file, imageMode, {}, hyperLink[0]?.data?.url ? hyperLink : [])
            }
            avatar={community.avatarFileUrl}
          />
        </div>
      </div>
    </>
  );
};

export default AmityDraftStoryPage;
