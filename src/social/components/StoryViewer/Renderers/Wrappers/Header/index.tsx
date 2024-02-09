import React from 'react';
import {
  PauseStoryButton,
  PlayStoryButton,
  ViewStoryHeaderContainer,
  ViewStoryHeadingInfoContainer,
  AvatarContainer,
  ViewStoryHeaderListActionsContainer,
  ViewStoryInfoContainer,
  ViewStoryHeading,
  ViewStorySubHeading,
  CloseButton,
  VerifiedBadge,
  DotsButton,
  AddStoryButton,
  ViewStoryHeadingTitle,
} from '../../styles';
import Truncate from 'react-truncate-markup';
import Avatar from '~/core/components/Avatar';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';

const Header: React.FC<
  React.PropsWithChildren<{
    avatar: string;
    heading: string;
    subheading: string;
    isOfficial: boolean;
    isPaused: boolean;
    isHaveActions: boolean;
    onPlay: () => void;
    onPause: () => void;
    onAction: () => void;
    onClose: () => void;
    onAddStory?: (file: File) => void;
    onMute?: () => void;
    onUnmute?: () => void;
    onClickCommunity: () => void;
    haveStoryPermission?: boolean;
  }>
> = ({
  avatar,
  heading,
  subheading,
  isHaveActions,
  isOfficial,
  isPaused,
  onAddStory,
  onPlay,
  onPause,
  onAction,
  onClose,
  onClickCommunity,
  haveStoryPermission,
  children,
}) => {
  const handleAddIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPause();

    if (onAddStory) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,video/*';

      input.addEventListener('change', (event) => {
        const selectedFile = (event.target as HTMLInputElement).files?.[0];
        onAddStory(selectedFile as File);
      });

      input.addEventListener('cancel', () => {
        onPlay();
      });

      input.click();
    }
  };

  return (
    <>
      <ViewStoryHeaderContainer>
        <ViewStoryHeadingInfoContainer>
          <AvatarContainer>
            <Avatar avatar={avatar} backgroundImage={communityBackgroundImage} />
            {haveStoryPermission && onAddStory && (
              <AddStoryButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddIconClick(e);
                }}
              />
            )}
          </AvatarContainer>
          <ViewStoryInfoContainer>
            <ViewStoryHeading>
              <Truncate lines={1}>
                <ViewStoryHeadingTitle onClick={onClickCommunity}>{heading}</ViewStoryHeadingTitle>
              </Truncate>
              {isOfficial && <VerifiedBadge />}
            </ViewStoryHeading>
            <ViewStorySubHeading>{subheading}</ViewStorySubHeading>
          </ViewStoryInfoContainer>
          <ViewStoryHeaderListActionsContainer>
            {isPaused ? (
              <PlayStoryButton onClick={onPlay} />
            ) : (
              <PauseStoryButton onClick={onPause} />
            )}
            {isHaveActions && <DotsButton onClick={onAction} />}
            <CloseButton onClick={onClose} />
          </ViewStoryHeaderListActionsContainer>
        </ViewStoryHeadingInfoContainer>
      </ViewStoryHeaderContainer>
      {children}
    </>
  );
};

export default Header;
