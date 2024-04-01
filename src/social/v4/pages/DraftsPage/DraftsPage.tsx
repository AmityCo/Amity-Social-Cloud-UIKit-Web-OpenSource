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

import { useCustomization } from '~/social/v4/providers/CustomizationProvider';
import {
  BackButton,
  AspectRatioButton,
  ShareStoryButton,
  HyperLinkButton,
} from '~/social/v4/elements';
import { useTheme } from 'styled-components';
import { usePageBehavior } from '~/social/v4/providers/PageBehaviorProvider';
import { HyperLinkBottomSheet } from '~/social/v4/internal-components/HyperLinkBottomSheet';

import { LinkButton } from '~/social/v4/elements/HyperLinkURL';
import { SubmitHandler } from 'react-hook-form';

type DraftStoryProps = {
  pageId: 'create_story_page';
  file: File;
  creatorAvatar: string;
  onCreateStory: (
    file: File,
    imageMode: 'fit' | 'fill',
    metadata?: Amity.Metadata,
    items?: Amity.StoryItem[],
  ) => void;
  onDiscardStory: () => void;
};

type HyperLinkFormInputs = {
  url: string;
  customText?: string;
};

export const DraftsPage = ({ pageId, file, onDiscardStory, onCreateStory }: DraftStoryProps) => {
  const theme = useTheme();
  const { getConfig, isExcluded } = useCustomization();
  const pageConfig = getConfig(`${pageId}/*/*`);
  const isPageExcluded = isExcluded(`${pageId}/*/*`);
  const { navigationBehavior } = usePageBehavior();
  const [isHyperLinkBottomSheetOpen, setIsHyperLinkBottomSheetOpen] = useState(false);

  const [hyperLink, setHyperLink] = useState<Amity.StoryItem[] | []>([]);

  const pageThemePrimaryColor =
    pageConfig?.page_theme?.light_theme.primary_color || theme.v4.colors.primary.default;
  const pageThemeSecondaryColor =
    pageConfig?.page_theme?.light_theme.secondary_color || theme.v4.colors.secondary.default;

  if (isPageExcluded) return null;

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

  const discardCreateStory = () => {
    confirm({
      title: formatMessage({ id: 'storyViewer.action.confirmModal.title' }),
      content: formatMessage({ id: 'storyViewer.action.confirmModal.content' }),
      cancelText: formatMessage({ id: 'general.action.cancel' }),
      okText: formatMessage({ id: 'delete' }),
      onOk: () => {
        onDiscardStory();
        navigationBehavior.closeAction();
      },
    });
  };

  const onSubmitHyperLink = (data: Amity.StoryItem) => {
    setHyperLink([
      {
        data: {
          url: data.data.url,
          customText: data.data.customText,
        },
        type: data.type,
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
          <BackButton
            pageId="create_story_page"
            componentId="*"
            onClick={discardCreateStory}
            style={{
              backgroundColor: pageThemeSecondaryColor,
            }}
          />
        </div>
        <ActionsContainer>
          {file?.type.includes('image') && (
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

      {file?.type.includes('image') ? (
        <DraftImageContainer colors={colors}>
          <DraftImage
            colors={colors}
            src={file && URL.createObjectURL(file)}
            imageMode={imageMode}
          />
        </DraftImageContainer>
      ) : (
        <StoryVideoPreview
          src={file && URL.createObjectURL(file)}
          mediaFit="contain"
          autoPlay
          controls={false}
        />
      )}

      <StoryDraftFooter>
        <ShareStoryButton
          pageId="create_story_page"
          componentId="*"
          onClick={() => onCreateStory(file, imageMode, {}, hyperLink)}
          avatar={creatorAvatar}
          style={{
            color: pageThemeSecondaryColor,
            backgroundColor: pageThemePrimaryColor,
          }}
        />
      </StoryDraftFooter>
      <HyperLinkBottomSheet
        pageId="create_story_page"
        isHaveHyperLink={!!hyperLink?.[0]?.data?.url}
        isOpen={isHyperLinkBottomSheetOpen}
        onClose={handleHyperLinkBottomSheetClose}
        onSubmit={onSubmitHyperLink}
        onRemove={onRemoveHyperLink}
      />
      {/* currently we enable hyperlink to show only one hyperlink */}
      {hyperLink?.[0]?.data?.url && (
        <LinkButtonContainer>
          <LinkButton href={hyperLink[0].data?.url}>
            <Truncate lines={1}>
              <span>{hyperLink[0].data?.customText || hyperLink[0].data?.url}</span>
            </Truncate>
          </LinkButton>
        </LinkButtonContainer>
      )}
    </StoryDraftContainer>
  );
};
