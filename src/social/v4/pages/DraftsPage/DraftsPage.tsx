import React, { useEffect, useState } from 'react';

import {
  ActionsContainer,
  StoryDraftContainer,
  StoryDraftHeader,
  StoryDraftFooter,
  DraftImage,
  DraftImageContainer,
  StoryVideoPreview,
  LinkButtonContainer,
} from './styles';
import { useIntl } from 'react-intl';
import { extractColors } from 'extract-colors';
import { confirm } from '~/core/components/Confirm';
import { readFileAsync } from '~/helpers';

import useUser from '~/core/hooks/useUser';
import useSDK from '~/core/hooks/useSDK';
import useImage from '~/core/hooks/useImage';

import Truncate from 'react-truncate-markup';

import {
  BackButton,
  AspectRatioButton,
  ShareStoryButton,
  HyperLinkButton,
} from '~/social/v4/elements';

import { usePageBehavior } from '~/social/v4/providers/PageBehaviorProvider';

import { HyperLink } from '~/social/v4/elements/HyperLink';
import { SubmitHandler } from 'react-hook-form';
import { HyperLinkConfig } from '../../components/HyperLinkConfig';
import { useStoryContext } from '~/v4/social/providers/StoryProvider';
import { StoryRepository } from '@amityco/ts-sdk';
import { notification } from '~/core/components/Notification';

type DraftStoryProps = {
  targetId: string;
  targetType: Amity.StoryTargetType;
  mediaType: 'image' | 'video';
};

type HyperLinkFormInputs = {
  url: string;
  customText?: string;
};

export const DraftsPage = ({ targetId, targetType, mediaType }: DraftStoryProps) => {
  const { file, setFile } = useStoryContext();
  const { navigationBehavior } = usePageBehavior();
  const [isHyperLinkBottomSheetOpen, setIsHyperLinkBottomSheetOpen] = useState(false);

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
      // TODO: Fix type
      type: 'hyperlink' as Amity.StoryItemType,
    },
  ]);

  const onSubmit: SubmitHandler<HyperLinkFormInputs> = (data) => {
    onSubmit(data);
  };

  const handleHyperLinkBottomSheetClose = () => {
    setIsHyperLinkBottomSheetOpen(false);
  };

  const { currentUserId } = useSDK();
  const user = useUser(currentUserId);
  const creatorAvatar = useImage({ imageSize: 'small', fileId: user?.avatarFileId });

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
    const formData = new FormData();
    formData.append('files', file);
    setFile(null);
    if (file?.type.includes('image')) {
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
    } else {
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
  };

  const discardCreateStory = () => {
    confirm({
      title: formatMessage({ id: 'storyViewer.action.confirmModal.title' }),
      content: formatMessage({ id: 'storyViewer.action.confirmModal.content' }),
      cancelText: formatMessage({ id: 'general.action.cancel' }),
      okText: formatMessage({ id: 'delete' }),
      onOk: () => {
        setFile(null);
        navigationBehavior.closeAction();
      },
    });
  };

  const onSubmitHyperLink = ({ url, customText }: { url: string; customText: string }) => {
    setHyperLink([
      {
        data: {
          url,
          customText,
        },
        // TODO: Fix type
        type: 'hyperlink' as Amity.StoryItemType,
      },
    ]);
    setIsHyperLinkBottomSheetOpen(false);
  };

  const onRemoveHyperLink = () => {
    setHyperLink([]);
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

    if (file?.type.includes('image')) {
      extractColorsFromImage(file);
    }
  }, [file, imageMode]);

  return (
    <StoryDraftContainer id="asc-uikit-create-story">
      <StoryDraftHeader>
        <div>
          <BackButton pageId="create_story_page" componentId="*" onClick={discardCreateStory} />
        </div>
        <ActionsContainer>
          {mediaType === 'image' && (
            <AspectRatioButton
              pageId="create_story_page"
              componentId="*"
              onClick={onClickImageMode}
            />
          )}
          <HyperLinkButton
            pageId="create_story_page"
            componentId="*"
            onClick={() => setIsHyperLinkBottomSheetOpen(true)}
          />
        </ActionsContainer>
      </StoryDraftHeader>

      {file && mediaType === 'image' ? (
        <DraftImageContainer colors={colors}>
          <DraftImage
            colors={colors}
            src={file && URL.createObjectURL(file)}
            imageMode={imageMode}
          />
        </DraftImageContainer>
      ) : (
        <StoryVideoPreview
          src={(file && URL.createObjectURL(file)) || ''}
          mediaFit="contain"
          autoPlay
          controls={false}
        />
      )}

      <StoryDraftFooter>
        <ShareStoryButton
          pageId="create_story_page"
          componentId="*"
          onClick={() => onCreateStory(file, imageMode, {}, hyperLink[0].data.url ? hyperLink : [])}
          avatar={creatorAvatar}
        />
      </StoryDraftFooter>
      <HyperLinkConfig
        pageId="*"
        isHaveHyperLink={!!hyperLink?.[0]?.data?.url}
        isOpen={isHyperLinkBottomSheetOpen}
        onClose={handleHyperLinkBottomSheetClose}
        onSubmit={onSubmitHyperLink}
        onRemove={onRemoveHyperLink}
      />
      {/* currently we enable hyperlink to show only one hyperlink */}
      {hyperLink?.[0]?.data?.url && (
        <LinkButtonContainer>
          <HyperLink href={hyperLink[0].data?.url}>
            <Truncate lines={1}>
              <span>{hyperLink[0].data?.customText || hyperLink[0].data?.url}</span>
            </Truncate>
          </HyperLink>
        </LinkButtonContainer>
      )}
    </StoryDraftContainer>
  );
};
