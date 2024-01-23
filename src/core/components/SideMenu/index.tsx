import styled from 'styled-components';
import { CloseIcon } from '~/V4/icons';

export const SideMenuHeader = styled.div`
  @media (min-width: 768px) {
    display: none;
  }

  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e6e6e6;
`;

export const SideMenuTitle = styled.div`
  ${({ theme }) => theme.typography.title}
`;

export const SideMenuCloseButton = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
`;

export const SideMenuCloseIcon = styled(CloseIcon)`
  width: 1.5rem;
  height: 1.5rem;
  color: ${({ theme }) => theme.palette.base.main};
`;

export default styled.div`
  background-color: white;
  border: 1px solid #e6e6e6;
  width: 280px;
  overflow: auto;
  flex-shrink: 0;
  ${({ theme }) => theme.typography.title}
`;
