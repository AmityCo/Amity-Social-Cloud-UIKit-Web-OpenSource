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
import { hashtagRegex, hashtagTextRegex } from '~/v4/social/utils/hashtagRegex';
import { SerializedHashtagNode } from './nodes/HashtagNode';
import { URL_REGEX } from '~/v4/social/constants/post';
import { ProductMentionData } from '~/v4/core/components/TextEditor/TextEditor';

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

export function $isSerializedHashtagNode(
  node: SerializedLexicalNode,
): node is SerializedHashtagNode {
  return node.type === 'hashtag';
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

function createSerializeUserMentionNode({
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

function createSerializeProductMentionNode({
  text,
  mention,
}: {
  text: string;
  mention: Amity.TextProductTag;
}): SerializedMentionNode<ProductMentionData> {
  return {
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text: text.substring(mention.index, mention.index + mention.length),
    type: 'mention',
    version: 1,
    data: {
      displayName: mention.product?.productName || (mention.productId as string),
      productId: mention.productId as string,
      product: mention.product!,
    },
  };
}

function createSerializeHashtagNode({
  text,
  hashtag,
}: {
  text: string;
  hashtag: Amity.Hashtag;
}): SerializedHashtagNode {
  return {
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text: text.substring(hashtag.index, hashtag.index + hashtag.length),
    type: 'hashtag',
    version: 1,
    hashtag: hashtag.text,
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

function isLinkData(data: HighLightData): data is Amity.Link {
  return (data as Amity.Link)?.url !== undefined;
}

function extractHashtagsFromText(
  text: string,
  urlRanges: Array<{ start: number; end: number }> = [],
): Amity.Hashtag[] {
  const hashtags: Amity.Hashtag[] = [];
  let match;
  let count = 0;

  // Helper function to check if a position is within any URL range
  const isWithinUrlRange = (position: number): boolean => {
    return urlRanges.some((range) => position >= range.start && position <= range.end);
  };

  while ((match = hashtagRegex.exec(text)) !== null && count < 30) {
    const hashtagText = match[1];
    const hashtagStart = match.index;

    // Skip if the hashtag is within a URL range
    if (isWithinUrlRange(hashtagStart)) {
      continue;
    }

    if (hashtagTextRegex.test(hashtagText)) {
      hashtags.push({
        text: hashtagText,
        index: hashtagStart,
        length: match[0].length, // includes #
      });
      count++;
    }
  }

  return hashtags;
}

type HighLightData = Mentioned | Amity.Link | Amity.Hashtag | Amity.TextProductTag;

function isHashtagData(data: HighLightData): data is Amity.Hashtag {
  return (data as Amity.Hashtag)?.text !== undefined;
}

function isMentionData(data: HighLightData): data is Mentioned {
  return (data as Mentioned)?.userId !== undefined;
}

function isTextProductTag(data: HighLightData): data is Amity.TextProductTag {
  return (data as Amity.TextProductTag)?.productId !== undefined;
}

export function textToEditorState(value: {
  data: { text: string };
  metadata?: {
    mentioned?: Mentioned[];
    hashtags?: Amity.Hashtag[];
  };
  mentionees?: Mentionees;
  hashtags?: string[];
  links?: Amity.Link[];
  productTags?: Amity.TextProductTag[];
}) {
  const rootNode = createRootNode();

  const textArray = value.data.text.split('\n');

  const mentions = value.metadata?.mentioned ?? [];

  const productTags = value.productTags ?? [];

  const links = value.links ?? [];

  // Create URL ranges for hashtag extraction
  const urlRanges =
    links.length > 0
      ? links.map((link) => ({
          start: link.index || 0,
          end: link.index && link.length ? link.index + link.length - 1 : 0,
        }))
      : undefined;

  const hashtags = extractHashtagsFromText(value.data.text, urlRanges);

  const indexMap: Record<number, boolean> = {};

  const mentionsLinksAndHashtags = [...mentions, ...links, ...hashtags, ...productTags]
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .reduce((acc, item) => {
      // this function is used to remove duplicate mentions and links that cause an infinite loop
      if (item.index === undefined || indexMap[item.index]) {
        return acc;
      }

      indexMap[item.index] = true;
      return [...acc, item];
    }, [] as HighLightData[]);

  let itemIndex = 0;
  let globalIndex = 0;

  for (let i = 0; i < textArray.length; i += 1) {
    const paragraph = createParagraphNode();
    let runningIndex = 0;

    const currentLine = textArray[i];

    while (runningIndex < currentLine.length) {
      const currentItem = mentionsLinksAndHashtags[itemIndex];

      if (itemIndex < mentionsLinksAndHashtags.length && currentItem.index === globalIndex) {
        const currentItem = mentionsLinksAndHashtags[itemIndex];

        if (isLinkData(currentItem) && currentItem.index !== undefined) {
          const linkText = value.data.text.substring(
            currentItem.index,
            currentItem.index + (currentItem.length ?? 0),
          );
          paragraph.children.push(
            createSerializeLinkNode({
              title: linkText,
              url: currentItem.url,
            }),
          );
          runningIndex += currentItem.length ?? 0;
          globalIndex += currentItem.length ?? 0;
        } else if (isHashtagData(currentItem)) {
          paragraph.children.push(
            createSerializeHashtagNode({
              text: value.data.text,
              hashtag: currentItem,
            }),
          );
          runningIndex += currentItem.length;
          globalIndex += currentItem.length;
        } else if (isMentionData(currentItem)) {
          paragraph.children.push(
            createSerializeUserMentionNode({
              text: value.data.text,
              mention: currentItem,
            }),
          );
          runningIndex += currentItem.length + 1;
          globalIndex += currentItem.length + 1;
        } else if (isTextProductTag(currentItem)) {
          paragraph.children.push(
            createSerializeProductMentionNode({
              text: value.data.text,
              mention: currentItem,
            }),
          );
          runningIndex += currentItem.length;
          globalIndex += currentItem.length;
        }

        itemIndex += 1;
      } else {
        const nextItemIndex =
          itemIndex < mentionsLinksAndHashtags.length
            ? currentItem.index ?? globalIndex + currentLine.length
            : globalIndex + currentLine.length;

        const endIndex = Math.min(
          Math.max(nextItemIndex - globalIndex + runningIndex, runningIndex),
          currentLine.length,
        );
        const textSegment = currentLine.slice(runningIndex, endIndex);

        if (textSegment && textSegment.length > 0) {
          paragraph.children.push(createSerializeTextNode(textSegment));
          globalIndex += textSegment.length;
          runningIndex += textSegment.length;
        } else {
          runningIndex += 1;
          globalIndex += 1;
        }
      }
    }

    if (runningIndex < currentLine.length) {
      const textSegment = currentLine.slice(runningIndex);
      if (textSegment && textSegment.length > 0) {
        paragraph.children.push(createSerializeTextNode(textSegment));
        globalIndex += textSegment.length;
      }
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
  const textProductTags: Amity.TextProductTag[] = [];
  const hashtags: Amity.Hashtag[] = [];
  const links: Amity.Link[] = [];
  let isChannelMentioned = false;
  const mentioneeUserIds: string[] = [];
  let runningIndex = 0;

  paragraphs.forEach((paragraph) => {
    const children = paragraph.children;
    const paragraphText: string[] = [];

    children.forEach(
      (
        child:
          | SerializedTextNode
          | SerializedMentionNode<MentionData | ProductMentionData>
          | SerializedAutoLinkNode
          | SerializedHashtagNode
          | { type: 'linebreak'; version: number },
      ) => {
        // Handle line break nodes (Shift+Enter)
        if (child.type === 'linebreak') {
          paragraphText.push('\n');
          runningIndex += 1;
          return;
        }

        if ($isSerializedTextNode(child)) {
          paragraphText.push(child.text);
          runningIndex += child.text.length;
        }
        if ($isSerializedLinkNode(child) || $isSerializedAutoLinkNode(child)) {
          const linkText = child.children
            .filter((c): c is SerializedTextNode => $isSerializedTextNode(c))
            .map((c) => c.text)
            .join('');

          // Validate link against URL_REGEX pattern
          const urlRegex = new RegExp(URL_REGEX);
          if (urlRegex.test(linkText)) {
            links.push({
              index: runningIndex,
              length: linkText.length,
              url: linkText,
              renderPreview: true,
            });
          }

          child.children.forEach((c) => {
            if (!$isSerializedTextNode(c)) return;
            paragraphText.push(c.text);
            runningIndex += c.text.length;
          });
        }

        if ($isSerializedHashtagNode(child)) {
          hashtags.push({
            text: child.hashtag,
            index: runningIndex,
            length: child.text.length - 1,
          });
          paragraphText.push(child.text);
          runningIndex += child.text.length;
        }

        if ($isSerializedMentionNode<MentionData | ProductMentionData>(child)) {
          const isStartWithAtSign = child.text.charAt(0) === '@';

          if ('userId' in child.data && child.data.userId === 'all') {
            mentioned.push({
              index: runningIndex,
              length: child.text.length,
              type: 'channel',
            });
            isChannelMentioned = true;
          } else if ('userId' in child.data) {
            const textLength = isStartWithAtSign ? child.text.length - 1 : child.text.length;
            mentioned.push({
              index: runningIndex,
              length: textLength,
              type: 'user',
              userId: child.data.userId,
              displayName: child.data.displayName,
            });
            mentioneeUserIds.push(child.data.userId);
          } else {
            textProductTags.push({
              index: runningIndex,
              length: child.text.length,
              productId: child.data.productId,
              text: child.data.displayName,
              product: child.data.product,
            });
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

  return {
    mentioned,
    hashtags,
    text: editorStateTextString.join('\n'),
    mentionees,
    links,
    textProductTags,
  };
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
  editable = true,
}: {
  namespace: string;
  theme: EditorThemeClasses;
  nodes: Array<Klass<LexicalNode>>;
  editorState?: InitialEditorStateType;
  editable?: boolean;
}): InitialConfigType => ({
  namespace,
  editable,
  theme: { ...defaultTheme, ...theme },
  onError(error: Error) {
    throw error;
  },
  nodes,
  editorState,
});
