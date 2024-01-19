import styled from 'styled-components';

export const ListItemContainer = styled.div``;

export const EmptyStateIcon = styled.span`
  svg {
    font-size: 25px;
  }
`;

export const WrapEmptyState = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const InfiniteScrollContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  flex-grow: 1;
  overflow: auto;
  background: #f7f7f8;
`;
