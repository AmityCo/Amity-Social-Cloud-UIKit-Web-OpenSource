import styled from 'styled-components';

export const EmptyStateContainer = styled.div`
  color: ${({ theme }) => theme.palette.base.shade3};
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 5rem 0.5rem;
  background: ${({ theme }) => theme.palette.system.background};
  color: ${({ theme }) => theme.palette.base.shade3};
  ${({ theme }) => theme.typography.body};
`;

export const EmptyStateTitle = styled.div`
  ${({ theme }) => theme.typography.title};
  margin-top: 8px;
`;

export const EmptyStateDescription = styled.div`
  ${({ theme }) => theme.typography.body}
`;
