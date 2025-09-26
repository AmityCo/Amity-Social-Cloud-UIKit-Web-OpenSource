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
  commandPriority,
  onEnter,
}: {
  commandPriority: CommandListenerPriority;
  onEnter: () => void;
}) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.registerCommand(
      KEY_ENTER_COMMAND,
      (payload) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        if ($isVisualKeyboardOpen(window)) {
          return false;
        }

        const event = payload as KeyboardEvent;
        event.preventDefault();

        if (event.shiftKey) {
          return editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND, undefined);
        }

        onEnter();
        return true;
      },
      commandPriority,
    );
  }, [editor, onEnter]);
  return null;
};
