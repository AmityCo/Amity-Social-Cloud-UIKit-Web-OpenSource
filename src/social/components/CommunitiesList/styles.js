import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

export const CommunityScrollContainer = styled(InfiniteScroll)`
  &.no-scroll {
    width: 260px;
  }
`;

export const NoResultsMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.palette.base.shade3};
`;
