import { unified } from 'unified';
import markdown from 'remark-parse';
import remarkGfm from 'remark-gfm';
import slate, { serialize, defaultNodeTypes } from 'remark-slate';
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_MENTION,
  isElement,
  ELEMENT_PARAGRAPH,
  isText,
  ELEMENT_LI,
} from '@udecode/plate';

import { MentionSymbol, ObfuscatedMentionRegex } from './plugins/mentionPlugin/constants';
import { MentionOutput } from './plugins/mentionPlugin/models';
import {
  stripMentionTags,
  mentionElementToStringWithTags,
  mentionElementToStringWithoutTags,
  obfuscateMentionTags,
  breakTextNodeIntoMentions,
} from './plugins/mentionPlugin/utils';

import { EMPTY_VALUE } from './constants';
import {
  EditorValue,
  Descendant,
  Element,
  RichText,
  BlockquoteElement,
  ParagraphElement,
  MentionElement,
  ListItemElement,
} from './models';

const DEFAULT_HEADINGS = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

const SERIALIZE_OPTS = {
  nodeTypes: {
    ...defaultNodeTypes,
    paragraph: 'p',
    heading: { ...DEFAULT_HEADINGS },
    link: 'a',
    block_quote: 'blockquote',
    ul_list: 'ul',
    ol_list: 'ol',
    listItem: 'li',
    emphasis_mark: 'italic',
    strong_mark: 'bold',
    delete_mark: 'strikeThrough',
    inline_code_mark: 'code',
  },
  ignoreParagraphNewline: true,
};

type TransformMetadata = { mentions?: MentionOutput[] };
type TransformMap = Partial<
  Record<
    Element['type'] | 'text',
    (el: Descendant, metadata?: TransformMetadata, nodeDepth?: number) => Descendant | Descendant[]
  >
>;

function transformNodes(
  slateNode: Descendant,
  transformations: typeof serializeTransformElement,
  metadata?: TransformMetadata,
  nodeDepth = 0,
): Descendant | Descendant[] {
  const node =
    isElement(slateNode) && typeof transformations[slateNode.type] === 'function'
      ? transformations[slateNode.type]?.(slateNode, metadata, nodeDepth)
      : slateNode;

  if (isElement(node) && node.children) {
    return {
      ...node,
      children: node.children.flatMap(
        (child) => transformNodes(child, transformations, metadata, nodeDepth + 1),
        1,
      ),
    } as Descendant;
  }

  if (isText(node) && transformations.text) {
    return transformations.text(node) as Descendant;
  }

  return node as Descendant;
}

const deserializeTransformElement: TransformMap = {
  // Unwrap the paragraph from block quote children
  [ELEMENT_BLOCKQUOTE]: (el: BlockquoteElement) =>
    ({
      type: ELEMENT_BLOCKQUOTE,
      children:
        el.children?.[0].type === ELEMENT_PARAGRAPH
          ? (el.children?.[0] as unknown as ParagraphElement).children
          : el.children,
    } as BlockquoteElement),
  text: (el: RichText) => breakTextNodeIntoMentions(el, ObfuscatedMentionRegex),
};

export function markdownToSlate(markdownText: string, mentions?: MentionOutput[]): EditorValue {
  if (markdownText === '') {
    return [EMPTY_VALUE];
  }

  const slateState = unified()
    .use(markdown)
    .use(remarkGfm)
    .use(slate, SERIALIZE_OPTS)
    .processSync(obfuscateMentionTags(markdownText)).result as EditorValue;

  const processedState = slateState.map((node) =>
    transformNodes(node, deserializeTransformElement, { mentions }),
  );

  return processedState as EditorValue;
}

const serializeTransformElement: TransformMap = {
  // Render mentions as text
  [ELEMENT_MENTION]: (el: MentionElement) => ({
    text: `${MentionSymbol[el.mentionType]}[${el.value}](${el.id})`,
  }),

  // Add space to list items to prevent broken markdown when the last text node does not have a space
  [ELEMENT_LI]: (el: ListItemElement) =>
    ({
      type: ELEMENT_LI,
      children: el.children?.map((ch) => {
        if (isElement(ch) && ch.type === ELEMENT_PARAGRAPH && ch.children) {
          const lastNode = ch.children[Math.max(ch.children.length - 1, 0)];
          if (isText(lastNode) && lastNode.text?.[Math.max(lastNode.text.length - 1, 0)] !== ' ') {
            return { type: ELEMENT_PARAGRAPH, children: [...ch.children, { text: ' ' }] };
          }
        }

        return ch;
      }),
    } as ListItemElement),

  // Add newline to top level paragraphs
  [ELEMENT_PARAGRAPH]: (el: ParagraphElement, _metadata, nodeDepth) => ({
    type: ELEMENT_PARAGRAPH,
    children: nodeDepth === 0 ? [...el.children, { text: '\n' }] : el.children,
  }),
};

/** Export mentions from Slate state to a format Amity understands (react-mentions) */
function exportMentions(slateState: EditorValue, text: string): MentionOutput[] {
  const mentions = [] as MentionOutput[];
  const lastIndexRef = { current: 0 };
  const plainTextIndexRef = { current: 0 };
  const textWithRemovedMentionTags = stripMentionTags(text);

  function processDescendants(decendants: Descendant[]) {
    decendants.forEach((decendant) => {
      if (isElement(decendant)) {
        if (decendant.type === ELEMENT_MENTION) {
          const displayWithTags = mentionElementToStringWithTags(decendant as MentionElement);
          const displayWithoutTags = mentionElementToStringWithoutTags(decendant as MentionElement);
          const index =
            text.substring(lastIndexRef.current).indexOf(displayWithTags) + lastIndexRef.current;

          const plainTextIndex =
            textWithRemovedMentionTags
              .substring(plainTextIndexRef.current)
              .indexOf(displayWithoutTags) + plainTextIndexRef.current;

          mentions.push({
            id: decendant.id as string,
            display: displayWithoutTags,
            index,
            plainTextIndex,
            childIndex: 0,
          });

          lastIndexRef.current = index + displayWithTags.length;
          plainTextIndexRef.current = plainTextIndex + displayWithoutTags.length;
        }

        if (decendant.children) {
          processDescendants(decendant.children);
        }
      }
    });
  }

  processDescendants(slateState);

  return mentions;
}

export function slateToMarkdown(slateState: EditorValue) {
  const text = slateState
    .map((v) => transformNodes(v, serializeTransformElement))
    .map((v) => serialize(v as any, SERIALIZE_OPTS as any))
    .join('')
    .replace(/(\n\s*?\n)\s*\n/, '$1')
    .replaceAll('&#39;', '&apos;')
    .trim();

  const mentions: MentionOutput[] = exportMentions(slateState, text);

  return { text, mentions };
}
