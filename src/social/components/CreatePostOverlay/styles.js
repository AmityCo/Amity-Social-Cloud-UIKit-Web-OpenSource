import styled from 'styled-components';

export const Overlay = styled.div`
  /* display: none; */
  display: block;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 600;

  .postComposeBar {
    position: relative;
    top: 20%;
  }
`;
