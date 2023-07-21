import React from 'react';
import styled from 'styled-components';

import { CloseButton } from '~/core/components/ImageGallery/styles';

export const Overlay = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  z-index: 10000;
`;

const closeVideoOverlay = () => {
  document.getElementById('video-overlay').style.display = 'none';
  console.log('CLICKED');
};

export const FeaturedVideoOverlay = (src = '') => {
  return (
    <Overlay id="video-overlay">
      <CloseButton className="absolute right-5 top-5" onClick={closeVideoOverlay} />
      <video className="w-[300px] md:w-[400px]" controls>
        <source src={src} type="video/mp4" />
      </video>
    </Overlay>
  );
};
