import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

export const CommunityScrollContainer = styled(InfiniteScroll)`
  &.no-scroll {
    width: 260px;
  }
`;

export const Container = styled.div`
  position: relative;
  padding: 16px 0;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  @media screen and (min-width: 768px) {
    display: none;
  }
  div {
    padding: 0;
    border-top: none;
    h4,
    button {
      display: none;
    }
  }

  .infinite-scroll-component__outerdiv .infinite-scroll-component > div {
    display: flex;

    a {
      display: flex;
      flex-direction: column;
      .Avatar {
        width: 80px;
        height: 80px;
      }
      .cym-h-4 {
        margin-top: 4px;
      }
    }
  }
`;

export const MobileCommunitiesHeader = styled.h3`
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
`;
