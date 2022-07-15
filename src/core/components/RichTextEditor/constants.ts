import { ELEMENT_PARAGRAPH } from '@udecode/plate';
import { ParagraphElement } from './models';

export const EMPTY_VALUE: ParagraphElement = {
  type: ELEMENT_PARAGRAPH,
  url: undefined,
  children: [{ text: '' }],
};
