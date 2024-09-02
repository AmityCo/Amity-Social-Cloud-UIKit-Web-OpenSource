import { SerializedAutoLinkNode } from '@lexical/link';
import { InitialConfigType, InitialEditorStateType } from '@lexical/react/LexicalComposer';
import {
  EditorThemeClasses,
  Klass,
  LexicalEditor,
  LexicalNode,
  SerializedLexicalNode,
  SerializedParagraphNode,
  SerializedRootNode,
  SerializedTextNode,
} from 'lexical';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import { SerializedMentionNode } from './nodes/MentionNode';

export interface EditorStateJson extends SerializedLexicalNode {
  children: [];
}

export function $isSerializedTextNode(node: SerializedLexicalNode): node is SerializedTextNode {
  return node.type === 'text';
}

export function $isSerializedMentionNode<T>(
  node: SerializedLexicalNode,
): node is SerializedMentionNode<T> {
  return node.type === 'mention';
}

export function $isSerializedAutoLinkNode(
  node: SerializedLexicalNode,
): node is SerializedAutoLinkNode {
  return node.type === 'autolink';
}

export type MentionData = {
  userId: string;
  displayName?: string;
};

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

function createSerializeMentionNode(mention: Mentioned): SerializedMentionNode<MentionData> {
  return {
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text: ('@' + mention.userId) as string,
    type: 'mention',
    version: 1,
    data: {
      displayName: mention.userId as string,
      userId: mention.userId as string,
    },
  };
}

export function textToEditorState(value: {
  data: { text: string };
  metadata?: {
    mentioned?: Mentioned[];
  };
  mentionees?: Mentionees;
}) {
  const rootNode = createRootNode();

  const textArray = value.data.text.split('\n');

  const mentions = value.metadata?.mentioned || [];

  let mentionIndex = 0;
  let globalIndex = 0;

  for (let i = 0; i < textArray.length; i += 1) {
    const paragraph = createParagraphNode();
    let runningIndex = 0;

    while (runningIndex < textArray[i].length) {
      if (mentionIndex < mentions.length && mentions[mentionIndex].index === globalIndex) {
        paragraph.children.push(createSerializeMentionNode(mentions[mentionIndex]));
        runningIndex += mentions[mentionIndex].length;
        globalIndex += mentions[mentionIndex].length;
        mentionIndex += 1;
      } else {
        const nextMentionIndex =
          mentionIndex < mentions.length
            ? mentions[mentionIndex].index
            : globalIndex + textArray[i].length;
        const textSegment = textArray[i].slice(
          runningIndex,
          nextMentionIndex - globalIndex + runningIndex,
        );
        if (textSegment) {
          paragraph.children.push(createSerializeTextNode(textSegment));
        }
        runningIndex += textSegment.length;
        globalIndex += textSegment.length;
      }
    }

    if (runningIndex < textArray[i].length) {
      const textSegment = textArray[i].slice(runningIndex);
      if (textSegment) {
        paragraph.children.push(createSerializeTextNode(textSegment));
      }
      globalIndex += textSegment.length;
    }

    globalIndex += 1;

    rootNode.children.push(paragraph);
  }

  return { root: rootNode };
}

export function editorStateToText(editor: LexicalEditor) {
  const editorStateTextString: string[] = [];
  const paragraphs = editor.getEditorState().toJSON().root.children as EditorStateJson[];

  const mentioned: Mentioned[] = [];
  let isChannelMentioned = false;
  const mentioneeUserIds: string[] = [];
  let runningIndex = 0;

  paragraphs.forEach((paragraph) => {
    const children = paragraph.children;
    const paragraphText: string[] = [];

    children.forEach(
      (child: SerializedTextNode | SerializedMentionNode<MentionData> | SerializedAutoLinkNode) => {
        if ($isSerializedTextNode(child)) {
          paragraphText.push(child.text);
          runningIndex += child.text.length;
        }
        if ($isSerializedAutoLinkNode(child)) {
          child.children.forEach((c) => {
            if (!$isSerializedTextNode(c)) return;
            paragraphText.push(c.text);
            runningIndex += c.text.length;
          });
        }

        if ($isSerializedMentionNode<MentionData>(child)) {
          if (child.data.userId === 'all') {
            mentioned.push({
              index: runningIndex,
              length: child.text.length,
              type: 'channel',
            });
            isChannelMentioned = true;
          } else {
            mentioned.push({
              index: runningIndex,
              length: child.text.length,
              type: 'user',
              userId: child.data.userId,
            });
            mentioneeUserIds.push(child.data.userId);
          }
          paragraphText.push(child.text);
          runningIndex += child.text.length;
        }
      },
    );
    runningIndex += 1;
    editorStateTextString.push(paragraphText.join(''));
  });

  const mentionees: Array<Amity.UserMention | Amity.ChannelMention> = [];

  if (mentioneeUserIds.length > 0) {
    mentionees.push({
      type: 'user',
      userIds: mentioneeUserIds,
    });
  }

  if (isChannelMentioned) {
    mentionees.push({ type: 'channel' });
  }

  return { mentioned, text: editorStateTextString.join('\n'), mentionees };
}

const defaultTheme = {
  ltr: 'ltr',
  rtl: 'rtl',
};

export const getEditorConfig = ({
  namespace,
  theme,
  nodes,
  editorState,
}: {
  namespace: string;
  theme: EditorThemeClasses;
  nodes: Array<Klass<LexicalNode>>;
  editorState?: InitialEditorStateType;
}): InitialConfigType => ({
  namespace,
  editable: true,
  theme: { ...defaultTheme, ...theme },
  onError(error: Error) {
    throw error;
  },
  nodes,
  editorState,
});
