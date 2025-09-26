import styled from 'styled-components';
import EmptyState from '~/core/components/EmptyState';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

export const ListEmptyState = styled(EmptyState)`
  margin-right: auto;
  margin-left: auto;
`;
