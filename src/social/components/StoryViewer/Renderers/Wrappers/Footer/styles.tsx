import styled from 'styled-components';
import { EyeIcon } from '~/icons';

export const ViewCountIcon = styled(EyeIcon)`
  color: #a5a9b5;
`;

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

export const ViewStoryUploadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
`;

export const ViewStoryCompostBarContainer = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3.5rem;
  padding: 0.75rem;
  background-color: #000;
  bottom: 0;
  color: #ffffff;
`;

export const ViewStoryFailedCompostBarContainer = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 3.5rem;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.palette.alert.main};
  color: #ffffff;
  z-index: 0;
`;

export const ViewStoryFailedCompostBarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  width: 100%;
`;

export const ViewStoryCompostBarViewIconContainer = styled.div`
  ${({ theme }) => theme.typography.bodyBold};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
`;

export const ViewStoryCompostBarEngagementContainer = styled.div`
  ${({ theme }) => theme.typography.bodyBold};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const ViewStoryCompostBarEngagementIconContainer = styled.div`
  ${({ theme }) => theme.typography.bodyBold};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
  border-radius: 1.5rem;
  padding: 0.5rem 0.625rem;
  background-color: #292b32;
`;

export const ViewStoryContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: black;
`;
