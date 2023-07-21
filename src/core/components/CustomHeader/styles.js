import styled from 'styled-components';

export const CustomHeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 15;
  display: flex;
  .infinite-scroll-component {
    width: 100%;
  }
`;
export const AvatarContainer = styled.div`
  display: block;
`;

export const SearchWrapper = styled.div`
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  @media screen and (min-width: 768px) {
    display: none;
  }

  [data-qa-anchor='social-search-input'] {
    height: 60px;
  }
`;
