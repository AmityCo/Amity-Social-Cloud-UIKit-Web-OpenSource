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
  VerifiedBadge,
  ViewStoryHeadingTitle,
} from '../../styles';
import Truncate from 'react-truncate-markup';
import Avatar from '~/core/components/Avatar';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';

import { OverflowMenuButton } from '~/social/v4/elements/OverflowMenuButton/OverflowMenuButton';
import { CloseButton } from '~/social/v4/elements/CloseButton/CloseButton';

const Header: React.FC<
  React.PropsWithChildren<{
    onPlay: () => void;
    onPause: () => void;
    onAction: () => void;
    onClose: () => void;
    onAddStory: (e: React.MouseEvent<Element, MouseEvent>) => void;
    onClickCommunity: () => void;
    avatar?: string;
    heading?: React.ReactNode;
    subheading?: React.ReactNode;
    isOfficial?: boolean;
    isPaused?: boolean;
    isHaveActions?: boolean;
    haveStoryPermission?: boolean;
    onMute?: () => void;
    onUnmute?: () => void;
    addStoryButton?: React.ReactNode;
  }>
> = ({
  avatar,
  heading,
  subheading,
  isHaveActions,
  isOfficial,
  isPaused,
  onPlay,
  onPause,
  onAction,
  onClose,
  onClickCommunity,
  haveStoryPermission,
  addStoryButton,
}) => {
  return (
    <>
      <ViewStoryHeaderContainer>
        <ViewStoryHeadingInfoContainer>
          <AvatarContainer>
            <Avatar
              data-qa-anchor="community_avatar"
              avatar={avatar}
              backgroundImage={communityBackgroundImage}
            />
            {haveStoryPermission && addStoryButton}
          </AvatarContainer>
          <ViewStoryInfoContainer>
            <ViewStoryHeading>
              <Truncate lines={1}>
                <ViewStoryHeadingTitle
                  data-qa-anchor="community_display_name"
                  onClick={onClickCommunity}
                >
                  {heading}
                </ViewStoryHeadingTitle>
              </Truncate>
              {isOfficial && <VerifiedBadge />}
            </ViewStoryHeading>
            <ViewStorySubHeading>{subheading}</ViewStorySubHeading>
          </ViewStoryInfoContainer>
          <ViewStoryHeaderListActionsContainer>
            {isPaused ? (
              <PlayStoryButton data-qa-anchor="play_button" onClick={onPlay} />
            ) : (
              <PauseStoryButton data-qa-anchor="pause_button" onClick={onPause} />
            )}
            {isHaveActions && (
              <OverflowMenuButton pageId="story_page" componentId="*" onClick={onAction} />
            )}
            <CloseButton pageId="story_page" componentId="*" onClick={onClose} />
          </ViewStoryHeaderListActionsContainer>
        </ViewStoryHeadingInfoContainer>
      </ViewStoryHeaderContainer>
    </>
  );
};

export default Header;
