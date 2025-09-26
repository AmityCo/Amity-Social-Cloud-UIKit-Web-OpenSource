import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { useEffect } from 'react';

type EditorTextCheckerProps = {
  setIsEmpty?: (empty: boolean) => void;
  setIsSpacebar?: (spacebar: boolean) => void;
};

export function EditorTextCheckerPlugin({ setIsSpacebar, setIsEmpty }: EditorTextCheckerProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const text = $getRoot().getTextContent();

        setIsEmpty?.(text.length === 0);
        setIsSpacebar?.(text.trim().length === 0);
      });
    });
  }, [editor, setIsSpacebar, setIsEmpty]);

  return null;
}
