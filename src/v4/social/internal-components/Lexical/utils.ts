import { SerializedAutoLinkNode, SerializedLinkNode } from '@lexical/link';
import { InitialConfigType, InitialEditorStateType } from '@lexical/react/LexicalComposer';
import {
  EditorThemeClasses,
  Klass,
  LexicalEditor,
  LexicalNode,
  SerializedEditorState,
  SerializedLexicalNode,
  SerializedParagraphNode,
  SerializedRootNode,
  SerializedTextNode,
} from 'lexical';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import { SerializedMentionNode } from './nodes/MentionNode';
import * as linkify from 'linkifyjs';

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

export function $isSerializedLinkNode(node: SerializedLexicalNode): node is SerializedLinkNode {
  return node.type === 'link';
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
    textStyle: '',
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

function createSerializeMentionNode({
  text,
  mention,
}: {
  text: string;
  mention: Mentioned;
}): SerializedMentionNode<MentionData> {
  return {
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text: text.substring(mention.index, mention.index + mention.length + 1),
    type: 'mention',
    version: 1,
    data: {
      displayName: mention.displayName || (mention.userId as string),
      userId: mention.userId as string,
    },
  };
}

function createSerializeLinkNode({
  url,
  title,
}: {
  url: string;
  title: string;
}): SerializedLinkNode {
  return {
    children: [createSerializeTextNode(title)],
    format: '',
    direction: 'ltr',
    indent: 0,
    type: 'link',
    version: 1,
    url,
    rel: null,
    target: null,
    title: null,
  };
}

type LinkData = Mentioned & {
  href: string;
  value: string;
};

function isLinkData(data: Mentioned | LinkData): data is LinkData {
  return (data as LinkData)?.type === 'url';
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

  const mentions = value.metadata?.mentioned ?? [];

  const links: Array<LinkData> = linkify
    .find(value.data.text)
    .filter((link) => link.type === 'url')
    .map((link) => ({
      index: link.start,
      length: link.end - link.start + 1,
      href: link.href,
      value: link.value,
      type: 'url',
    }));

  const indexMap: Record<number, boolean> = {};

  const mentionsAndLinks = [...mentions, ...links]
    .sort((a, b) => a.index - b.index)
    .reduce((acc, mentionAndLink) => {
      // this function is used to remove duplicate mentions and links that cause an infinite loop
      if (indexMap[mentionAndLink.index]) {
        return acc;
      }

      indexMap[mentionAndLink.index] = true;
      return [...acc, mentionAndLink];
    }, [] as Mentioned[]);

  let mentionAndLinkIndex = 0;
  let globalIndex = 0;

  for (let i = 0; i < textArray.length; i += 1) {
    const paragraph = createParagraphNode();
    let runningIndex = 0;

    const currentLine = textArray[i];

    while (runningIndex < currentLine.length) {
      const mentionOrLink = mentionsAndLinks[mentionAndLinkIndex];

      if (mentionAndLinkIndex < mentionsAndLinks.length && mentionOrLink.index === globalIndex) {
        const mentionOrLink = mentionsAndLinks[mentionAndLinkIndex];

        if (isLinkData(mentionOrLink)) {
          paragraph.children.push(
            createSerializeLinkNode({
              title: mentionOrLink.value,
              url: mentionOrLink.href,
            }),
          );
          runningIndex += mentionOrLink.length;
          globalIndex += mentionOrLink.length;
        } else {
          paragraph.children.push(
            createSerializeMentionNode({
              text: value.data.text,
              mention: mentionOrLink,
            }),
          );
          runningIndex += mentionOrLink.length + 1;
          globalIndex += mentionOrLink.length + 1;
        }

        mentionAndLinkIndex += 1;
      } else {
        const nextMentionIndex =
          mentionAndLinkIndex < mentionsAndLinks.length
            ? mentionOrLink.index
            : globalIndex + currentLine.length;
        const textSegment = currentLine.slice(
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

    if (runningIndex < currentLine.length) {
      const textSegment = currentLine.slice(runningIndex);
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

export function editorToText(editor: LexicalEditor) {
  const editorState = editor.getEditorState().toJSON();
  return editorStateToText(editorState);
}

export function editorStateToText(editorState: SerializedEditorState) {
  const editorStateTextString: string[] = [];
  const paragraphs = editorState.root.children as EditorStateJson[];

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
          const isStartWithAtSign = child.text.charAt(0) === '@';

          if (child.data.userId === 'all') {
            mentioned.push({
              index: runningIndex,
              length: child.text.length,
              type: 'channel',
            });
            isChannelMentioned = true;
          } else {
            const textLength = isStartWithAtSign ? child.text.length - 1 : child.text.length;
            mentioned.push({
              index: runningIndex,
              length: textLength,
              type: 'user',
              userId: child.data.userId,
              displayName: child.data.displayName,
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
