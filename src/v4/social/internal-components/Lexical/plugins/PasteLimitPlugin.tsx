import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import {
  $createParagraphNode,
  $createRangeSelection,
  $createTextNode,
  $getRoot,
  $setSelection,
} from 'lexical';

const MAX_CHAR_LIMIT = 200;

export function PasteLimitPlugin({ maxCharactor = MAX_CHAR_LIMIT }: { maxCharactor: number }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerRootListener((rootElement) => {
      if (!rootElement) return;

      const handlePaste = () => {
        // Read the current editor content BEFORE any updates
        editor.getEditorState().read(() => {
          const currentText = $getRoot().getTextContent();
          const currentLength = currentText.length;

          // If it is not over the max character length, skip slicing
          if (currentLength - maxCharactor <= 0) return;
          const allowedText = currentText.slice(0, maxCharactor);

          // Insert the allowed text at the selection
          editor.update(() => {
            const root = $getRoot();
            root.clear(); // This removes all nodes inside the editor

            // TODO: support other node type in the future
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(allowedText));
            root.append(paragraph);

            // Move the cursor to the end
            const textNodes = root.getAllTextNodes();
            if (textNodes.length > 0) {
              const lastNode = textNodes[textNodes.length - 1];
              const nodeLength = lastNode.getTextContentSize();

              const newSel = $createRangeSelection();
              newSel.anchor.set(lastNode.getKey(), nodeLength, 'text');
              newSel.focus.set(lastNode.getKey(), nodeLength, 'text');
              $setSelection(newSel);
            }
          });
        });
      };

      rootElement.addEventListener('paste', handlePaste);
      return () => {
        rootElement.removeEventListener('paste', handlePaste);
      };
    });
  }, [editor, maxCharactor]);

  return null;
}
