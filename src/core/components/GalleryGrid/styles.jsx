import React from 'react';
import styled from 'styled-components';

const Image = styled.img.attrs({ loading: 'lazy' })`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

export const ImageRenderer = (url) => <Image key={url} src={url} />;
