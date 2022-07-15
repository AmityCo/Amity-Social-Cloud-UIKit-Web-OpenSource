import {
  createBoldPlugin,
  createCodePlugin,
  createItalicPlugin,
  createStrikethroughPlugin,
  createPlugins,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH as MARK_STRIKETHROUGH_ORIGINAL,
  withProps,
} from '@udecode/plate';
import { Text } from '@noom/wax-component-library';

import { createFocusSaverPlugin } from './focusSaverPlugin';

import { EditorValue, Editor, MARK_STRIKETHROUGH } from '../models';

export const defaultMarkComponentMap = {
  [MARK_BOLD]: withProps(Text, { as: 'strong' }),
  [MARK_CODE]: withProps(Text, { as: 'code' }),
  [MARK_ITALIC]: withProps(Text, { as: 'em' }),
  [MARK_STRIKETHROUGH_ORIGINAL]: withProps(Text, { as: 's' }),
};

export const defaultMarksPlugins = createPlugins<EditorValue, Editor>(
  [
    createBoldPlugin(),
    createCodePlugin(),
    createItalicPlugin(),
    createStrikethroughPlugin(),
    createFocusSaverPlugin(),
  ],
  {
    components: defaultMarkComponentMap,
    // Override because remark-slate can not be reconfigured for it
    overrideByKey: {
      [MARK_STRIKETHROUGH_ORIGINAL]: { key: MARK_STRIKETHROUGH },
    },
  },
);
