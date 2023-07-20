import styled from 'styled-components';

export const ScrollContainer = styled.div`
  overflow-x: hidden;
`;
export const StretchedList = styled.div`
  margin-bottom: 0.188rem; // give the shadow a little space
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  grid-gap: ${ITEM_SPACE_SIZE}px;

  ${({ columns }) =>
    Object.entries(columns).map(
      ([breakpoint, column]) => `
        @media (min-width: ${breakpoint}px) {
        grid-auto-columns: calc((100% / ${column}) - (${ITEM_SPACE_SIZE}px * ${
        column - 1
      } / ${column}));
    }
  `,
    )} );
`;
