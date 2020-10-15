import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

export const FeedScrollContainer = styled(InfiniteScroll)`
  & .post,
  & .postComposeBar {
    margin-bottom: 20px;
  }
`;
