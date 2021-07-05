import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

export const FeedScrollContainer = styled(InfiniteScroll)`
  > :not(:first-child) {
    margin-top: 20px;
  }

  & .post:not(:first-child) {
    margin-top: 20px;
  }

  & .load-more {
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;
