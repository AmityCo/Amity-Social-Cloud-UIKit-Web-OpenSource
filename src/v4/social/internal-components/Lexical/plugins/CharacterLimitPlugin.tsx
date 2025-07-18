import { $getRoot, COMMAND_PRIORITY_LOW, KEY_DOWN_COMMAND } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

const MAX_CHAR_LIMIT = 280;

export function CharacterLimitPlugin({ maxCharactor = MAX_CHAR_LIMIT }: { maxCharactor: number }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Prevent typing over limit
    const removeKeyDown = editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event) => {
        const currentLength = $getRoot().getTextContentSize();
        if (currentLength >= maxCharactor) {
          const allowedKeys = [
            'Backspace',
            'Delete',
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'ArrowDown',
          ];

          if (event.metaKey || event.ctrlKey || allowedKeys.includes(event.key)) {
            return false;
          }

          event.preventDefault();
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );

    return () => {
      removeKeyDown();
    };
  }, [editor]);

  return null;
}
