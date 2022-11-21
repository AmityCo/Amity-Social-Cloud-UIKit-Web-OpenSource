/* eslint-disable no-param-reassign */
import {
  createPluginFactory,
  setMarks,
  removeMark,
  isSelectionExpanded,
  withProps,
} from '@udecode/plate';

import { Text } from '@noom/wax-component-library';

import { Editor, EditorValue } from '../models';

const FOCUS_SAVER_MARK = 'focus-saver';

/**
 * It is used for interacting with components outside of the editor. For example a link modal.
 * Clicking on a modal causes the editor to lose focus. So when you get back the selector would be
 * reset to the beginning of the end of the document. This preserves the selection to be where you
 * left it before losing focus.
 */
export const createFocusSaverPlugin = createPluginFactory<EditorValue, any>({
  key: FOCUS_SAVER_MARK,
  isLeaf: true,
  handlers: {
    onBlur: (editor: Editor) => (event) => {
      event.preventDefault();
      const currentSelection = editor.selection;
      const hasSelection = !!currentSelection && isSelectionExpanded(editor);

      if (hasSelection) {
        setMarks(editor, { [FOCUS_SAVER_MARK]: true });
        editor.prevSelection = editor.selection || null;
      }
    },
    onFocus: (editor: Editor) => (event) => {
      event.preventDefault();
      const { prevSelection } = editor;
      if (prevSelection) {
        removeMark(editor, {
          key: FOCUS_SAVER_MARK,
          shouldChange: false,
          mode: 'all',
        });

        editor.prevSelection = null;
      }
    },
  },
  component: withProps(Text, { bg: 'primary.300', color: 'white' }),
});
