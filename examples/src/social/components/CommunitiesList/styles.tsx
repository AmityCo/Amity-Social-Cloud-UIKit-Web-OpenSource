import React from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

const CustomInfiniteScroll = (props: React.ComponentProps<typeof InfiniteScroll>) => (
  <InfiniteScroll {...props} />
);

export const CommunityScrollContainer = styled(CustomInfiniteScroll)`
  &.no-scroll {
    width: 260px;
  }
`;

export const NoResultsMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.palette.base.shade3};
`;
