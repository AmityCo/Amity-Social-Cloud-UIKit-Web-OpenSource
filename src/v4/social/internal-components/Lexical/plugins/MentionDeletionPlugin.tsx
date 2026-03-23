import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from 'lexical';
import { $isMentionNode } from '~/v4/social/internal-components/Lexical/nodes/MentionNode';

export function MentionDeletionPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }

        // Check if selection is collapsed (cursor position, not a range)
        if (!selection.isCollapsed()) {
          return false;
        }

        const anchor = selection.anchor;
        const anchorNode = anchor.getNode();

        // Check if we're at the end of a mention node
        if ($isMentionNode(anchorNode) && anchor.offset === anchorNode.getTextContentSize()) {
          event?.preventDefault();
          anchorNode.remove();
          return true;
        }

        // Check if the previous sibling is a mention node
        const prevSibling = anchorNode.getPreviousSibling();
        if (anchor.offset === 0 && $isMentionNode(prevSibling)) {
          event?.preventDefault();
          prevSibling.remove();
          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_HIGH,
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      KEY_DELETE_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }

        // Check if selection is collapsed (cursor position, not a range)
        if (!selection.isCollapsed()) {
          return false;
        }

        const anchor = selection.anchor;
        const anchorNode = anchor.getNode();

        // Check if we're at the start of a mention node
        if ($isMentionNode(anchorNode) && anchor.offset === 0) {
          event?.preventDefault();
          anchorNode.remove();
          return true;
        }

        // Check if the next sibling is a mention node
        const nextSibling = anchorNode.getNextSibling();
        if (anchor.offset === anchorNode.getTextContentSize() && $isMentionNode(nextSibling)) {
          event?.preventDefault();
          nextSibling.remove();
          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_HIGH,
    );
  }, [editor]);

  return null;
}
