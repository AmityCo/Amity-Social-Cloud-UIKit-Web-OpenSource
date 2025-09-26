import styled from 'styled-components';
import GalleryContent from '~/social/components/post/GalleryContent';

export const LivestreamRenderer = styled(GalleryContent)`
  margin-right: calc(-1rem - 1px);
  margin-left: calc(-1rem - 1px);
  width: auto;
  // component's height / width should be about 0.56 according design
  // why 60% not 56%? - something wrong with styles
  padding-bottom: 60%;
`;
