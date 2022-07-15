import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_TD,
  SoftBreakPlugin,
} from '@udecode/plate';
import { EditorPlugin } from '../models';

export const softBreakPlugin: Partial<EditorPlugin<SoftBreakPlugin>> = {
  options: {
    rules: [
      { hotkey: 'shift+enter' },
      {
        hotkey: 'enter',
        query: {
          allow: [ELEMENT_CODE_BLOCK, ELEMENT_TD],
        },
      },
    ],
  },
};
