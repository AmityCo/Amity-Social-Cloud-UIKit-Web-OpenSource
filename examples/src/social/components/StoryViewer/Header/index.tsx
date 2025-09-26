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
  ViewStoryHeadingTitle,
} from './styles';
import Truncate from 'react-truncate-markup';
import Avatar from '~/core/components/Avatar';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';

interface StoryViewerHeaderProps {
  heading: string | undefined;
  subheading: string | undefined;
  avatarUrl: string | undefined;
  isOfficial: boolean;
  haveStoryPermission?: boolean;
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
  haveStoryPermission,
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
          {haveStoryPermission && onAddStory && (
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
            <Truncate lines={1}>
              <ViewStoryHeadingTitle>{heading}</ViewStoryHeadingTitle>
            </Truncate>
            {isOfficial && <VerifiedBadge />}
          </ViewStoryHeading>
          <ViewStorySubheading>{subheading}</ViewStorySubheading>
        </ViewStoryInfoContainer>
        <ViewStoryHeaderListActionsContainer>
          {haveStoryPermission && <DotsButton onClick={onAction} />}
          <CloseButton onClick={onClose} />
        </ViewStoryHeaderListActionsContainer>
      </ViewStoryHeadingInfoContainer>
    </ViewStoryHeaderContainer>
  );
};

export default StoryViewerHeader;
