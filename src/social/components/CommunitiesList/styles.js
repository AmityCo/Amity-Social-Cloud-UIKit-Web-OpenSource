import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';

export const CommunityScrollContainer = styled(InfiniteScroll)`
  &.no-scroll {
    width: 260px;
  }
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const NoResultsMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.palette.base.shade3};
`;
