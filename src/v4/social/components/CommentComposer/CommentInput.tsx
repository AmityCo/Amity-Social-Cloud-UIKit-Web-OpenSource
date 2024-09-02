import React, { forwardRef, MutableRefObject, useImperativeHandle } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';
import {
  $getRoot,
  LexicalEditor,
  SerializedLexicalNode,
  SerializedTextNode,
  SerializedRootNode,
  SerializedParagraphNode,
} from 'lexical';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import {
  MentionNode,
  SerializedMentionNode,
} from '~/v4/social/internal-components/MentionTextInput/MentionNodes';
import styles from './CommentInput.module.css';
import { CommentMentionInput } from '~/v4/social/components/CommentMentionInput';
import { useMentionUsers } from '~/v4/social/hooks/useMentionUser';
import { CreateCommentParams } from '~/v4/social/components/CommentComposer/CommentComposer';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';

const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: styles.editorPlaceholder,
  paragraph: styles.editorParagraph,
};

const editorConfig = {
  namespace: 'CommentInput',
  theme: theme,
  onError(error: Error) {
    throw error;
  },
  nodes: [MentionNode],
};

interface EditorStateJson extends SerializedLexicalNode {
  children: [];
}

interface CommentInputProps {
  community?: Amity.Community | null;
  value?: CreateCommentParams;
  mentionOffsetBottom?: number;
  maxLines?: number;
  placehoder?: string;
  targetType?: string;
  targetId?: string;
  ref: MutableRefObject<LexicalEditor | null | undefined>;
  onChange: (data: CreateCommentParams) => void;
}

export interface CommentInputRef {
  clearEditorState: () => void;
}

function editorStateToText(editor: LexicalEditor): CreateCommentParams {
  const editorStateTextString: string[] = [];
  const paragraphs = editor.getEditorState().toJSON().root.children as EditorStateJson[];

  const mentioned: Mentioned[] = [];
  const mentionees: {
    type: Amity.Mention['type'];
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

  return {
    data: { text: editorStateTextString.join('\n') },
    mentionees,
    metadata: {
      mentioned,
    },
  };
}

function createRootNode(): SerializedRootNode<SerializedParagraphNode> {
  return {
    children: [],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  };
}

function createParagraphNode(): SerializedParagraphNode {
  return {
    children: [],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'paragraph',
    version: 1,
    textFormat: 0,
  };
}

function createSerializeTextNode(text: string): SerializedTextNode {
  return {
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text,
    type: 'text',
    version: 1,
  };
}

function createSerializeMentionNode(mention: Mentioned): SerializedMentionNode {
  return {
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text: ('@' + mention.userId) as string,
    type: 'mention',
    version: 1,
    mentionName: mention.userId as string,
    displayName: mention.userId as string,
    userId: mention.userId as string,
    userInternalId: mention.userId as string,
    userPublicId: mention.userId as string,
  };
}

export function TextToEditorState(value: {
  data: { text: string };
  metadata?: {
    mentioned?: Mentioned[];
  };
  mentionees?: Mentionees;
}) {
  const rootNode = createRootNode();

  const textArray = value.data.text.split('\n');

  const mentions = value.metadata?.mentioned;

  let start = 0;
  let stop = -1;
  let mentionRunningIndex = 0;

  for (let i = 0; i < textArray.length; i++) {
    start = stop + 1;
    stop = start + textArray[i].length;

    const paragraph = createParagraphNode();

    if (Array.isArray(mentions) && mentions?.length > 0) {
      let runningIndex = 0;

      while (runningIndex < textArray[i].length) {
        if (mentionRunningIndex >= mentions.length) {
          paragraph.children.push(createSerializeTextNode(textArray[i].slice(runningIndex)));
          runningIndex = textArray[i].length;
          break;
        }

        if (mentions[mentionRunningIndex].index >= stop) {
          paragraph.children.push(createSerializeTextNode(textArray[i]));
          runningIndex = textArray[i].length;
        } else {
          const text = textArray[i].slice(
            runningIndex,
            runningIndex + mentions[mentionRunningIndex]?.index - start,
          );

          if (text) {
            paragraph.children.push(createSerializeTextNode(text));
          }

          paragraph.children.push(createSerializeMentionNode(mentions[mentionRunningIndex]));

          runningIndex +=
            mentions[mentionRunningIndex].index + mentions[mentionRunningIndex].length - start;

          mentionRunningIndex++;
        }
      }
    }

    if (!mentions || mentions?.length === 0) {
      const textNode = createSerializeTextNode(textArray[i]);
      paragraph.children.push(textNode);
    }

    rootNode.children.push(paragraph);
  }

  return { root: rootNode };
}

export const CommentInput = forwardRef<CommentInputRef, CommentInputProps>(
  ({ community, mentionOffsetBottom = 0, value, onChange, maxLines = 10, placehoder }, ref) => {
    const editorRef = React.useRef<LexicalEditor | null | undefined>(null);
    const [queryMentionUser, setQueryMentionUser] = React.useState<string | null>(null);

    const { mentionUsers } = useMentionUsers({
      displayName: queryMentionUser || '',
      community,
    });

    const clearEditorState = () => {
      editorRef.current?.update(() => {
        const root = $getRoot();
        root.clear();
      });
    };

    useImperativeHandle(ref, () => ({
      clearEditorState,
    }));

    return (
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(value?.data.text ? { editorState: JSON.stringify(TextToEditorState(value)) } : {}),
        }}
      >
        <div
          className={styles.editorContainer}
          style={
            {
              '--var-max-lines': maxLines,
            } as React.CSSProperties
          }
        >
          <RichTextPlugin
            contentEditable={<ContentEditable className={styles.editorEditableContent} />}
            placeholder={
              placehoder ? <div className={styles.editorPlaceholder}>{placehoder}</div> : null
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={(editorState, editor) => {
              onChange(editorStateToText(editor));
            }}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <EditorRefPlugin editorRef={editorRef} />
          <CommentMentionInput
            mentionUsers={mentionUsers as Amity.User[]}
            onQueryChange={(query: string) => setQueryMentionUser(query)}
            offsetBottom={mentionOffsetBottom}
          />
        </div>
      </LexicalComposer>
    );
  },
);
