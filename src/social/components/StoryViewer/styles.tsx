import styled from 'styled-components';
import Sheet from 'react-modal-sheet';
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  CloseIcon,
  CommentIcon,
  DotsIcon,
  EyeIcon,
  LikeIcon,
  TrashIcon,
  Verified,
} from '~/icons';

export const StoryWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 2rem;
  gap: 1rem;
  background-color: #000;
`;

export const StoryActionSheet = styled(Sheet)`
  margin: 0 auto;
  max-width: 23.438rem;
`;

export const CloseButton = styled(CloseIcon)`
  color: #ffffff;
  cursor: pointer;
`;

export const VerifiedBadge = styled(Verified)`
  color: #ffffff;
`;

export const DotsButton = styled(DotsIcon)`
  cursor: pointer;
  color: #ffffff;
`;

export const ViewCountIcon = styled(EyeIcon)`
  color: #a5a9b5;
`;

export const LikeButton = styled(LikeIcon)``;

export const CommentButton = styled(CommentIcon)``;

export const StoryContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ViewStoryInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 100%;
`;

export const StoryTabBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  height: 5rem;
`;

export const ViewStoryCompostBarContainer = styled.div`
  width: 100%;
  display: flex;
  position: absolute;
  justify-content: space-between;
  align-items: center;
  height: 3.5rem;
  padding: 0.75rem;
  background-color: #000;
  bottom: 0;
`;

export const ViewStoryCompostBarViewIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  gap: 0.25rem;
`;

export const ViewStoryCompostBarEngagementContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  gap: 0.75rem;
`;

export const ViewStoryCompostBarEngagementIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  gap: 0.25rem;
  border-radius: 50%;
  padding: 0.5rem 0.625rem;
  background-color: #292b32;
`;

export const StoryContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  height: 5rem;
`;

export const ViewStoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ViewStoryContent = styled.div`
  position: relative;
  width: 23.438rem;
  height: 40.875rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 2;
`;

export const ViewStoryOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.16) 55.05%, rgba(255, 255, 255, 0) 96.52%);
  z-index: 3;
`;

export const ViewStoryHeaderContainer = styled.div`
  z-index: 2;
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: 1.5rem 1rem 0.625rem 1rem;
  gap: 0.5rem;
`;

export const AvatarContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  overflow: hidden;
`;

export const Avatar = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
`;

export const ViewStoryHeaderListActionsContainer = styled.div`
  display: flex;
  gap: 1.25rem;
  justify-content: flex-end;
  align-items: center;
`;

export const ViewStoryHeadingInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0.75rem;
  align-items: center;
`;

export const ViewStoryHeading = styled.div`
  display: flex;
  gap: 0.25rem;
  color: #fff;
  font-size: 0.938rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.25rem;
  letter-spacing: -0.24px;
  margin-right: 0.25rem;
  align-items: center;
`;

export const ViewStorySubheading = styled.span`
  display: inline-flex;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
  color: #fff;
  font-size: 0.813rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem;
  letter-spacing: -0.1px;
`;

export const ViewStoryImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ViewStoryImageContent = styled.img`
  flex: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ViewStoryVideoContent = styled.video`
  flex: 1;
  width: 100%;
  height: 100%;
`;

export const ViewStoryContentContainer = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
`;

export const TabBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  height: 5rem;
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const ActionList = styled.ul`
  list-style: none;
`;

export const ActionItem = styled.li`
  margin-bottom: 0.75rem;
`;

export const ActionButton = styled.button`
  border: none;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: transparent;
  cursor: pointer;
  justify-content: flex-start;
`;

export const DeleteIcon = styled(TrashIcon)`
  width: 1.5rem;
  height: 1.5rem;
  color: #292b32;
`;

export const StoryActionSheetContent = styled(Sheet.Content)`
  padding: 1rem 1.3rem;
`;

export const StoryActionItem = styled.button`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  background-color: #fff;
  cursor: pointer;
  color: #292b32;
  padding: 0.5rem;
  border-color: transparent;
  border-radius: 0.25rem;

  &:hover {
    background-color: ${({ theme }) => theme.palette.base.shade4};
    cursor: pointer;
  }
`;

export const StoryActionItemText = styled.div`
  ${({ theme }) => theme.typography.bodyBold};
  color: ${({ theme }) => theme.palette.base.main};
`;

export const StoryArrowLeftButton = styled(ArrowLeftCircle)`
  cursor: pointer;
`;

export const StoryArrowRightButton = styled(ArrowRightCircle)`
  cursor: pointer;
`;
