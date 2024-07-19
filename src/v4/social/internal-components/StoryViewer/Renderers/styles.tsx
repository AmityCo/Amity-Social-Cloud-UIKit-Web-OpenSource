import styled from 'styled-components';

import {
  PauseIcon,
  PlayIcon,
  AddIcon,
  Close,
  DotsIcon,
  VerifiedIcon,
  MuteCircle,
  UnmuteCircle,
} from '~/icons';

export const IconButton = styled.button`
  position: absolute;
  width: 2rem;
  height: 2rem;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  border: none;
  top: 6rem;
  left: 1.25rem;
  z-index: 9999;
  cursor: pointer;
`;

export const RendererContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const StoryVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const MuteCircleIcon = styled(MuteCircle)`
  width: 100%;
  height: 100%;
`;

export const UnmuteCircleIcon = styled(UnmuteCircle)`
  width: 100%;
  height: 100%;
`;

export const LoadingOverlay = styled.div<{
  width: number | string | undefined;
  height: number | string | undefined;
}>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ccc;
`;

export const StoryImage = styled.img<{ customStyles?: string }>`
  width: auto;
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  flex-grow: 1;
  ${(props) => props.customStyles};
`;

export const PlayStoryButton = styled(PlayIcon)`
  color: #ffffff;
  cursor: pointer;
`;

export const PauseStoryButton = styled(PauseIcon)`
  color: #ffffff;
  cursor: pointer;
`;

export const CloseButton = styled(Close)`
  color: #ffffff;
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
`;

export const VerifiedBadge = styled(VerifiedIcon)`
  color: #ffffff;
`;

export const DotsButton = styled(DotsIcon)`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  color: #ffffff;
`;

export const ViewStoryInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
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

export const StoryContent = styled.div`
  flex: 1;
`;

export const Header = styled.div`
  height: 5rem;
  padding: 0.75rem 1rem 0.625rem 1rem;
`;

export const ViewStoryContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: black;
`;

export const ViewStoryHeaderContainer = styled.div`
  z-index: 9999;
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
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  flex-shrink: 0;
`;

export const AddStoryButton = styled(AddIcon)`
  position: absolute;
  bottom: 0;
  right: 0;

  &:hover {
    cursor: pointer;
  }
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
  cursor: pointer;
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

export const ViewStoryHeadingTitle = styled.div`
  width: auto;
  max-width: 11.688rem;
`;

export const ViewStorySubHeading = styled.span`
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
