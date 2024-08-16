import React, { forwardRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalEditor, SerializedLexicalNode } from 'lexical';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { MentionNode } from '~/v4/social/internal-components/MentionTextInput/MentionNodes';
import { MentionTextInputPlugin } from '~/v4/social/internal-components/MentionTextInput/MentionTextInput';
import { CreatePostParams, MetaData } from '~/v4/social/pages/PostComposerPage/PostComposerPage';
import styles from './PostTextField.module.css';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import { textToEditorState } from '~/v4/social/utils/textToEditorState';

const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: styles.editorPlaceholder,
  paragraph: styles.editorParagraph,
};

interface EditorStateJson extends SerializedLexicalNode {
  children: [];
}

interface PostTextFieldProps {
  onChange: (data: CreatePostParams) => void;
  communityId?: string | null;
  onChangeSnap?: number;
  mentionContainer: HTMLElement | null;
  dataValue: {
    data: { text: string };
    metadata?: {
      mentioned?: Mentioned[];
    };
    mentionees?: Mentionees;
  };
}

function editorStateToText(editor: LexicalEditor) {
  const editorStateTextString: string[] = [];
  const paragraphs = editor.getEditorState().toJSON().root.children as EditorStateJson[];

  const mentioned: MetaData[] = [];
  const mentionees: {
    type: string;
    userIds: string[];
  }[] = [{ type: 'user', userIds: [] }];
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

        mentionees.length && mentionees[0].userIds.push(child.userId);
      }
      runningIndex += child.text.length;
    });
    runningIndex += 1;
    editorStateTextString.push(paragraphText.join(''));
  });
  return { mentioned, text: editorStateTextString.join('\n'), mentionees };
}

export const PostTextField = forwardRef<LexicalEditor, PostTextFieldProps>(
  ({ onChange, communityId, onChangeSnap, mentionContainer, dataValue }) => {
    const editorConfig = {
      namespace: 'PostTextField',
      theme: theme,
      onError(error: Error) {
        throw error;
      },
      nodes: [MentionNode],
    };
    return (
      <>
        <LexicalComposer
          initialConfig={{
            ...editorConfig,
            ...(dataValue?.data.text
              ? { editorState: JSON.stringify(textToEditorState(dataValue)) }
              : {}),
          }}
        >
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
            <MentionTextInputPlugin
              communityId={communityId}
              onChangeSnap={onChangeSnap}
              mentionContainer={mentionContainer}
            />
          </div>
        </LexicalComposer>
      </>
    );
  },
);
