import styled from 'styled-components';
import Avatar from '~/core/components/Avatar';
import { AddIcon, ErrorIcon } from '~/icons';

export const ErrorButton = styled(ErrorIcon)`
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: pointer;
  z-index: 2;
`;

export const AddStoryButton = styled(AddIcon)`
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: pointer;
  z-index: 2;
`;

export const StoryWrapper = styled.div`
  width: 3rem;
  height: 3rem;
  position: relative;
  cursor: pointer;
`;

export const StoryTabContainer = styled.div`
  position: relative;
  width: 3rem;
  display: flex;
  gap: 0.13rem;
  flex-direction: column;
  text-align: center;
  padding: 1rem 0.75rem;
  align-items: center;
`;

export const StoryAvatar = styled(Avatar)`
  width: 2.5rem;
  height: 2.5rem;
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  z-index: 1;
  cursor: pointer;
`;

export const StoryTitle = styled.div`
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.base.main};
  cursor: pointer;
`;

export const AddButton = styled(AddIcon)`
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: pointer;
  z-index: 2;
`;
