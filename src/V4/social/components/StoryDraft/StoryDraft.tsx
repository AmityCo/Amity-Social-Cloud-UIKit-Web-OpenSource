import React, { useEffect } from 'react';

import {
  ActionsContainer,
  IconButton,
  ShareStoryButton,
  ShareText,
  BackIcon,
  ExpandStoryIcon,
  StoryLinkIcon,
  ShareStoryIcon,
  StoryDraftContainer,
  StoryDraftHeader,
  StoryDraftFooter,
  DraftImage,
  DraftImageContainer,
} from './styles';
import { useIntl } from 'react-intl';
import { extractColors } from 'extract-colors';
import { confirm } from '~/core/components/Confirm';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';
import Avatar from '~/core/components/Avatar';
import { VideoPreview } from '~/core/components/Uploaders/Video/styles';
import { readFileAsync } from '~/helpers';

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

const StoryDraft = ({ file, onDiscardStory, onCreateStory }: DraftStoryProps) => {
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
    <div id="stories-viewer">
      <StoryDraftContainer>
        <StoryDraftHeader>
          <IconButton onClick={discardCreateStory}>
            <BackIcon />
          </IconButton>
          <ActionsContainer>
            {file?.type.includes('image') && (
              <IconButton onClick={onClickImageMode}>
                <ExpandStoryIcon />
              </IconButton>
            )}
            <IconButton>
              <StoryLinkIcon />
            </IconButton>
          </ActionsContainer>
        </StoryDraftHeader>

        {file?.type.includes('image') ? (
          <DraftImageContainer colors={colors}>
            <DraftImage
              colors={colors}
              src={URL.createObjectURL(file as File)}
              imageMode={imageMode}
            />
          </DraftImageContainer>
        ) : (
          <VideoPreview
            src={URL.createObjectURL(file as File)}
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
    </div>
  );
};
export default StoryDraft;
