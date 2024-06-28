import React, { forwardRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { $getRoot, EditorState, LexicalEditor, SerializedLexicalNode } from 'lexical';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { MentionNode } from '~/v4/social/internal-components/MentionTextInput/MentionNodes';
import { MentionTextInput } from '~/v4/social/internal-components/MentionTextInput/MentionTextInput';
import { MetaData, createPostParams } from '~/v4/social/pages/PostComposerPage/PostComposerPage';
import styles from './PostTextField.module.css';

const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: styles.editorPlaceholder,
  paragraph: styles.editorParagraph,
};

const editorConfig = {
  namespace: 'PostTextField',
  theme: theme,
  onError(error: Error) {
    throw error;
  },
  nodes: [MentionNode],
};

interface EditorStateJson extends SerializedLexicalNode {
  children: [];
}

interface PostTextFieldProps {
  onChange: (data: createPostParams) => void;
}

function editorStateToText(editor: LexicalEditor) {
  const editorStateTextString: string[] = [];
  const paragraphs = editor.getEditorState().toJSON().root.children as EditorStateJson[];

  const mentioned: MetaData[] = [];
  const mentionees: {
    type: string;
    userIds: string[];
  }[] = [];
  let runningIndex = 0;

  paragraphs.forEach((paragraph) => {
    const children = paragraph.children;
    const paragraphText: string[] = [];

    children.forEach((child: { type: string; text: string; userId: string }) => {
      if (child.text) {
        paragraphText.push(child.text);
      }
      if (child.type === 'mention') {
        mentioned.push({
          index: runningIndex,
          length: child.text.length,
          type: 'user',
          userId: child.userId,
        });

        mentionees.push({ type: 'user', userIds: [child.userId] });
      }
      runningIndex += child.text.length;
    });
    runningIndex += 1;
    editorStateTextString.push(paragraphText.join(''));
  });
  return { mentioned, text: editorStateTextString.join('\n'), mentionees };
}

export const PostTextField = forwardRef<LexicalEditor, PostTextFieldProps>(({ onChange }) => {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className={styles.editorContainer}>
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<div className={styles.editorPlaceholder}>What’s going on...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin
          onChange={(editorState, editor) => {
            onChange(editorStateToText(editor));
          }}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <MentionTextInput />
      </div>
    </LexicalComposer>
  );
});
