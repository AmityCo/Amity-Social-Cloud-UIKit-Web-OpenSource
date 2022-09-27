import styled from 'styled-components';
import EmptyState from '~/core/components/EmptyState';

const ITEM_SPACE_SIZE = 16;

export const Grid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${ITEM_SPACE_SIZE}px;

  & > div {
    min-width: auto;
    width: 100%;
    ${({ columns }) =>
      Object.entries(columns ?? {}).map(
        ([breakpoint, column]) => `
        @media (min-width: ${breakpoint}px) {
          width: calc((100% / ${column}) - (${ITEM_SPACE_SIZE}px * ${column - 1} / ${column}));
    }
  `,
      )}
  }
`;

export const ListEmptyState = styled(EmptyState)`
  margin-right: auto;
  margin-left: auto;
`;
