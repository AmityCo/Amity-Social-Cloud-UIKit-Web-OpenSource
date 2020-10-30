import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

export const FeedScrollContainer = styled(InfiniteScroll)`
  & .post,
  & .load-more {
    margin-top: 20px;
  }
  & .load-more {
    margin-bottom: 20px;
  }
`;
