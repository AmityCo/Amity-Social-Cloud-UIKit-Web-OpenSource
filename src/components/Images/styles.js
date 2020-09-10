import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';

export const RemoveIcon = styled(FaIcon).attrs({ icon: faTimes })`
  z-index: 2;
  cursor: pointer;
  margin-left: auto;
  position: absolute;
  right: 10px;
  top: 10px;
  background: rgba(17, 17, 17, 0.2);
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
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

export const ProgressBar = styled.div`
  background: ${({ theme }) => theme.palette.base.shade4};
  width: ${({ progress }) => 100 - progress}%;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0.3;
  z-index: 1;
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
