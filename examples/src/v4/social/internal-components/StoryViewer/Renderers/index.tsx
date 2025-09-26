import image from './Image';
import video from './Video';
import defaultRenderer from './Default';
import autoplayContent from './AutoPlayContent';
import { CustomRenderer, Tester } from './types';
import storyAd from './storyAd';

export const renderers: { renderer: CustomRenderer; tester: Tester }[] = [
  image,
  video,
  storyAd,
  autoplayContent,
  defaultRenderer,
];
