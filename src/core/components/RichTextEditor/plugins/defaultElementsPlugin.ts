import {
  createBlockquotePlugin,
  createHeadingPlugin,
  createParagraphPlugin,
  createExitBreakPlugin,
  createListPlugin,
  createResetNodePlugin,
  createSoftBreakPlugin,
  createPlugins,
  createComboboxPlugin,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_LINE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_LI,
  ELEMENT_LINK,
  ELEMENT_MENTION,
  ELEMENT_MENTION_INPUT,
  ELEMENT_PARAGRAPH,
  ELEMENT_TODO_LI,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_LIC,
  withProps,
} from '@udecode/plate';
import { Box, Link, H1, H2, H3, List, ListItem } from '@noom/wax-component-library';

import { EditorValue, Editor, MentionElement } from '../models';

import { resetBlockTypePlugin } from './resetBlockTypePlugin';
import { softBreakPlugin } from './softBreakPlugin';
import { exitBreakPlugin } from './exitBreakPlugin';
import { createMentionPlugin, Mention, MentionInput } from './mentionPlugin';
import { createLinkPlugin } from './linkPlugin';

export const defaultBlockComponentMap = {
  [ELEMENT_BLOCKQUOTE]: withProps(Box, {
    as: 'blockquote',
    ml: 1,
    pl: 1,
    borderLeft: '0.3em solid',
    borderColor: 'gray.200',
  }),
  [ELEMENT_CODE_LINE]: withProps(Box, { as: 'code' }),
  [ELEMENT_H1]: withProps(H1, { fontSize: '2.5em', mb: 4, fontWeight: 'bold' }),
  [ELEMENT_H2]: withProps(H2, { fontSize: '2em', mb: 2, fontWeight: 'bold' }),
  [ELEMENT_H3]: withProps(H3, { fontSize: '1.5em', mb: 1, fontWeight: 'bold' }),
  [ELEMENT_LI]: ListItem,
  [ELEMENT_LINK]: withProps(Link, { rel: 'noreferrer' }),

  [ELEMENT_MENTION]: Mention,
  [ELEMENT_MENTION_INPUT]: MentionInput,

  [ELEMENT_PARAGRAPH]: withProps(Box, { as: 'p', marginY: 2 }),
  [ELEMENT_TODO_LI]: withProps(ListItem, { sx: { '> p': { margin: 0 } } }),
  [ELEMENT_UL]: withProps(List, { ml: 0, paddingInlineStart: 4 }),
  [ELEMENT_OL]: withProps(List, { isOrdered: true, ml: 0, paddingInlineStart: 4 }),
};

export const mentionComponentMap = {
  [ELEMENT_MENTION]: Mention,
  [ELEMENT_MENTION_INPUT]: MentionInput,
};

export const defaultElementsPlugins = createPlugins<EditorValue, Editor>(
  [
    createBlockquotePlugin(),
    createHeadingPlugin(),
    createParagraphPlugin(),
    createResetNodePlugin(resetBlockTypePlugin),
    createSoftBreakPlugin(softBreakPlugin),
    createExitBreakPlugin(exitBreakPlugin),
    createListPlugin(),
    createLinkPlugin(),
    createMentionPlugin({
      options: {
        insertSpaceAfterMention: true,
        createMentionNode: (item) => {
          return {
            type: ELEMENT_MENTION,
            id: item.key,
            value: item.text,
            mentionType: 'user',
          } as MentionElement;
        },
      },
    }),
    createComboboxPlugin(),
  ],
  {
    components: {
      ...defaultBlockComponentMap,
      ...mentionComponentMap,
    },
    // Override because remark-slate can not be reconfigured for it
    overrideByKey: {
      [ELEMENT_LIC]: { type: ELEMENT_PARAGRAPH },
    },
  },
);
