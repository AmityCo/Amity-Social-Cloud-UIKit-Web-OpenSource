import styled from 'styled-components';
import { Icon } from '~/v4/core/components/Icon';

export const UIShareStoryButton = styled.button`
  display: inline-flex;
  height: 2.5rem;
  padding: 0.375rem 0.5rem 0.375rem 0.25rem;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  border-radius: 1.5rem;
  border: none;
  cursor: pointer;

  > span {
    ${({ theme }) => theme.typography.bodyBold};
  }
`;

export const ShareStoryIcon = styled(Icon)`
  margin-left: 0.5rem;
`;

export const RemoteImageIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  background-color: transparent;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
`;
