import React, { useEffect } from 'react';

import {
  ActionsContainer,
  IconButton,
  BackIcon,
  ExpandStoryIcon,
  StoryDraftContainer,
  StoryDraftHeader,
  StoryDraftFooter,
  DraftImage,
  DraftImageContainer,
  StoryVideoPreview,
  ShareStoryButton,
  ShareStoryIcon,
  ShareText,
} from './styles';
import { useIntl } from 'react-intl';
import { extractColors } from 'extract-colors';
import { confirm } from '~/core/components/Confirm';
import { readFileAsync } from '~/helpers';
import Avatar from '~/core/components/Avatar';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';

type DraftStoryProps = {
  file: File;
  creatorAvatar: string;
  onCreateStory: (
    file: File,
    imageMode: 'fit' | 'fill',
    metadata?: Amity.Metadata | undefined,
    items?: Amity.StoryItem[] | undefined,
  ) => void;
  onDiscardStory: () => void;
};

export const DraftsPage = ({ file, onDiscardStory, onCreateStory }: DraftStoryProps) => {
  const { formatMessage } = useIntl();

  const [imageMode, setImageMode] = React.useState<'fit' | 'fill'>('fit');
  const [colors, setColors] = React.useState<Awaited<ReturnType<typeof extractColors>>>([]);

  const onClickImageMode = () => {
    setImageMode(imageMode === 'fit' ? 'fill' : 'fit');
    if (imageMode === 'fill') {
      setColors([]);
    }
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

  const discardCreateStory = () => {
    confirm({
      title: formatMessage({ id: 'storyViewer.action.confirmModal.title' }),
      content: formatMessage({ id: 'storyViewer.action.confirmModal.content' }),
      cancelText: formatMessage({ id: 'general.action.cancel' }),
      okText: formatMessage({ id: 'delete' }),
      onOk: onDiscardStory,
    });
  };

  return (
    <StoryDraftContainer>
      <StoryDraftHeader>
        <BackIcon onClick={discardCreateStory} />
        <ActionsContainer>
          {file?.type.includes('image') && (
            <IconButton onClick={onClickImageMode}>
              <ExpandStoryIcon />
            </IconButton>
          )}
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
        <ShareStoryButton onClick={() => onCreateStory(file, imageMode, {}, [])}>
          <Avatar size="small" backgroundImage={communityBackgroundImage} />
          <ShareText>{formatMessage({ id: 'storyDraft.button.shareStory' })}</ShareText>
          <ShareStoryIcon />
        </ShareStoryButton>
      </StoryDraftFooter>
    </StoryDraftContainer>
  );
};
