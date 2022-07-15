import {
  createPluginFactory,
  isSelectionInMentionInput,
  mentionOnKeyDownHandler,
  withMention,
  ELEMENT_MENTION,
  ELEMENT_MENTION_INPUT,
} from '@udecode/plate';

import { MentionPlugin } from './models';

/**
 * Enables support for @mentions.
 */
export const createMentionPlugin = createPluginFactory<MentionPlugin>({
  key: ELEMENT_MENTION,
  isElement: true,
  isInline: true,
  isVoid: true,
  handlers: {
    onKeyDown: mentionOnKeyDownHandler({ query: isSelectionInMentionInput }),
  },
  withOverrides: withMention,
  options: {
    trigger: '@',
    createMentionNode: (item) => ({ value: item.text }),
    insertSpaceAfterMention: true,
  },
  plugins: [
    {
      key: ELEMENT_MENTION_INPUT,
      isElement: true,
      isInline: true,
    },
  ],
  then: (editor, { key }) => ({
    options: {
      id: key,
    },
  }),
});
