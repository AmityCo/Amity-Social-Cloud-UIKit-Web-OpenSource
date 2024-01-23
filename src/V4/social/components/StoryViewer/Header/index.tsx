import React from 'react';
import {
  ViewStoryHeaderContainer,
  ViewStoryHeadingInfoContainer,
  AvatarContainer,
  ViewStoryHeaderListActionsContainer,
  ViewStoryInfoContainer,
  ViewStoryHeading,
  ViewStorySubheading,
  CloseButton,
  VerifiedBadge,
  DotsButton,
  AddStoryButton,
  PauseStoryButton,
  PlayStoryButton,
} from './styles';
import Avatar from '~/core/components/Avatar';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';

interface StoryViewerHeaderProps {
  heading: string | undefined;
  subheading: string | undefined;
  avatarUrl: string | undefined;
  isOfficial: boolean;
  isPaused: boolean;
  isCreator: boolean;
  isMobile?: boolean;
  onPause: () => void;
  onPlay: () => void;
  onClose: () => void;
  onAction: () => void;
  onClickCommunity: () => void;
  onAddStory?: () => void;
}

const StoryViewerHeader = ({
  heading,
  subheading,
  avatarUrl,
  isOfficial,
  isPaused,
  isMobile,
  isCreator,
  onPause,
  onPlay,
  onClose,
  onAction,
  onAddStory,
  onClickCommunity,
}: StoryViewerHeaderProps) => {
  return (
    <ViewStoryHeaderContainer>
      <ViewStoryHeadingInfoContainer>
        <AvatarContainer>
          <Avatar avatar={avatarUrl} backgroundImage={communityBackgroundImage} />
          {onAddStory && (
            <AddStoryButton
              onClick={(e) => {
                e.stopPropagation();
                onAddStory();
              }}
            />
          )}
        </AvatarContainer>
        <ViewStoryInfoContainer>
          <ViewStoryHeading onClick={onClickCommunity}>
            {heading}
            {isOfficial && <VerifiedBadge />}
          </ViewStoryHeading>
          <ViewStorySubheading>{subheading}</ViewStorySubheading>
        </ViewStoryInfoContainer>
        <ViewStoryHeaderListActionsContainer>
          {!isMobile && isPaused && <PlayStoryButton onClick={onPlay} />}
          {!isMobile && !isPaused && <PauseStoryButton onClick={onPause} />}
          {isCreator && <DotsButton onClick={onAction} />}
          <CloseButton onClick={onClose} />
        </ViewStoryHeaderListActionsContainer>
      </ViewStoryHeadingInfoContainer>
    </ViewStoryHeaderContainer>
  );
};

export default StoryViewerHeader;
