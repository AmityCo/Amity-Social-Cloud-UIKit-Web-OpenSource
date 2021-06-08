import styled from 'styled-components';
import EmptyState from '~/core/components/EmptyState';

export const ListContainer = styled.div`
  padding: 1rem;
  padding-right: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.palette.system.borders};
  background: ${({ theme }) => theme.palette.system.background};
`;

export const Grid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  & > * {
    margin-bottom: 0.5rem;
    margin-right: 0.5rem;
  }
`;

export const ListEmptyState = styled(EmptyState)`
  margin-right: auto;
  margin-left: auto;
`;
