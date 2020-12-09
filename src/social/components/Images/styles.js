import styled from 'styled-components';

import { Close, ImageAttachment } from '~/icons';

export const CircleButton = styled.button`
  border-radius: 50%;
  width: 24px;
  height: 24px;
  position: absolute;
  top: 5%;
  right: 5%;
  font-size: 24px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  z-index: 3;
  border: none;
`;

export const CloseIcon = styled(Close)`
  color: #fff;
  font-size: 18px;
`;

export const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  ${({ editing }) => !editing && 'cursor: pointer;'}
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const one = `
  grid-template-rows: 380px;
`;

const two = `
  grid-template-columns: auto auto;
  grid-template-rows: 380px;
`;

const three = `
  grid-template-columns: auto auto;
  grid-template-rows: 220px 170px;
  ${ImageContainer}:first-child {
     grid-column: 1 / -1;
  }
`;

const four = `
  grid-template-columns: auto auto auto;
  grid-template-rows: 220px 170px;
  ${ImageContainer}:first-child {
     grid-column: 1 / -1;
  }
`;

const more = `
  grid-template-columns: repeat(auto-fill, 105px);
  ${ImageContainer} {
     border-radius: 6px;
     height: 105px;
     justify-content: space-evenly;
  }
`;

export const ImagesContainer = styled.div`
  display: grid;
  grid-gap: 8px;
  width: 100%;
  overflow: hidden;
  border-radius: 6px;
  ${({ length }) => {
    switch (length) {
      case 1:
        return one;
      case 2:
        return two;
      case 3:
        return three;
      case 4:
        return four;
      default:
        return more;
    }
  }}
`;

export const OverlayContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
`;

export const LoadingOverlay = styled.div`
  background: ${({ theme }) => theme.palette.base.shade4};
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  opacity: 0.4;
`;

export const ProgressBarContainer = styled.div`
  height: 5%;
  width: 60%;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  z-index: 3;
  overflow: hidden;
`;

export const NumberOfHiddenImagesOverlay = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  width: 100%;
  z-index: 2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.typography.headline}
  font-size: 32px;
`;

export const ImageUploadContainer = styled.div``;

export const FileInput = styled.input.attrs({ type: 'file' })`
  &&& {
    display: none;
  }
`;

export const Label = styled.label``;

export const ImageIcon = styled(ImageAttachment)`
  font-size: 18px;
  cursor: pointer;

  ${({ disabled, theme }) =>
    disabled &&
    `
      color: ${theme.palette.base.shade3};
      cursor: default;
  `}
`;
