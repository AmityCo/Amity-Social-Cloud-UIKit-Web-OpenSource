import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  CommandListenerPriority,
  INSERT_PARAGRAPH_COMMAND,
  KEY_ENTER_COMMAND,
} from 'lexical';
import { useEffect } from 'react';

const $isVisualKeyboardOpen = (window: Window) => {
  const ratio = (() => {
    switch (screen.orientation.type) {
      case 'landscape-primary':
      case 'landscape-secondary':
        return 0.5;
      case 'portrait-secondary':
      case 'portrait-primary':
        return 0.75;
      default:
        return 0.5;
    }
  })();

  if (!window.visualViewport) {
    return false;
  }

  return (
    (window.visualViewport?.height * window.visualViewport?.scale) / window.screen.height < ratio
  );
};

export const EnterKeyInterceptorPlugin = ({
  allowEnterNewLine = true,
  allowEnterToSend = false,
  commandPriority,
  onEnter,
}: {
  allowEnterNewLine?: boolean;
  allowEnterToSend?: boolean;
  commandPriority: CommandListenerPriority;
  onEnter: () => void;
}) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (payload) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        if (allowEnterNewLine && $isVisualKeyboardOpen(window)) {
          return false;
        }

        const event = payload as KeyboardEvent;
        event.preventDefault();

        // Shift+Enter inserts a new line only where new lines are allowed at all. A
        // single-line composer (e.g. livestream chat, `allowEnterNewLine={false}`) treats
        // Shift+Enter exactly like Enter, so the modifier cannot smuggle a line break in.
        if (event.shiftKey && allowEnterNewLine) {
          return editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND, undefined);
        }

        !allowEnterNewLine && allowEnterToSend && onEnter();
        return true;
      },
      commandPriority,
    );
  }, [editor, onEnter, allowEnterNewLine, allowEnterToSend, commandPriority]);

  return null;
};
