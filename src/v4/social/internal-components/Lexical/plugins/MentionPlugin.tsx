import React, { useCallback, useMemo } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuRenderFn,
  MenuTextMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import {
  $createTextNode,
  $insertNodes,
  CommandListenerPriority,
  NodeKey,
  TextNode,
  $getRoot,
  $isElementNode,
} from 'lexical';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { $isMentionNode } from '~/v4/social/internal-components/Lexical/nodes/MentionNode';
import { ProductMentionData } from '~/v4/core/components/TextEditor/TextEditor';
import { MentionData } from '~/v4/social/internal-components/Lexical/utils';
import { DEFAULT_MAX_PRODUCTS } from '~/v4/constants/text-editor';

const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']';

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION,
};

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ['@'].join('');

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = '[^' + TRIGGERS + PUNC + '\\s]';

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
  '(?:' +
  '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
  ' |' + // E.g. " " in "Josh Duck"
  '[' +
  PUNC +
  ']|' + // E.g. "-' in "Salier-Hellendag"
  ')';

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    VALID_JOINS +
    '){0,' +
    LENGTH_LIMIT +
    '})' +
    ')$',
);

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    '){0,' +
    ALIAS_LENGTH_LIMIT +
    '})' +
    ')$',
);

function checkForAtSignMentions(text: string, minMatchLength: number): MenuTextMatch | null {
  let match = AtSignMentionsRegex.exec(text);

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
  return checkForAtSignMentions(text, 0);
}

export class MentionTypeaheadOption<T> extends MenuOption {
  data: T;

  constructor({ data, dataId }: { data: T; dataId: string }) {
    super(dataId);
    this.data = data;
  }
}

function countMentions(type: 'user' | 'product' = 'user'): number {
  let count = 0;
  const root = $getRoot();

  function traverse(node: any) {
    if ($isMentionNode(node)) {
      const data = node.__data as MentionData | ProductMentionData;
      // Only count user mentions (not product mentions)
      if (type === 'user' && 'userId' in data && data.userId) {
        count++;
      } else if (type === 'product' && 'productId' in data && data.productId) {
        count++;
      }
    }
    if ($isElementNode(node)) {
      const children = node.getChildren();
      for (const child of children) {
        traverse(child);
      }
    }
  }

  traverse(root);
  return count;
}

export function MentionPlugin<
  TData extends MentionData | ProductMentionData,
  TNode extends TextNode,
>({
  suggestions,
  getSuggestionId,
  onQueryChange,
  $createNode,
  menuRenderFn,
  commandPriority,
  anchorClassName,
  maxMentions,
  maxUniqueProductMentions,
}: {
  suggestions: TData[];
  getSuggestionId: (suggestion: TData) => string;
  onQueryChange: (queryString: string | null) => void;
  $createNode: (data: TData, key?: NodeKey) => TNode;
  menuRenderFn: MenuRenderFn<MentionTypeaheadOption<TData>>;
  commandPriority: CommandListenerPriority;
  anchorClassName?: string;
  maxMentions?: number;
  maxUniqueProductMentions?: number;
}) {
  const [editor] = useLexicalComposerContext();
  const { info } = useConfirmContext();

  const options: MentionTypeaheadOption<TData>[] = useMemo(
    () =>
      suggestions.map(
        (suggestion) =>
          new MentionTypeaheadOption<TData>({
            data: suggestion,
            dataId: getSuggestionId(suggestion),
          }),
      ),
    [suggestions],
  );

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption<TData>,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        // Check if this is a product mention
        const isProductMention = 'productId' in selectedOption.data;

        // Check if we've reached the mention limit (for user mentions)
        if (!isProductMention && maxMentions !== undefined) {
          const currentMentionCount = countMentions();
          if (currentMentionCount >= maxMentions) {
            info({
              title: 'Too many users mentioned',
              content: `You can only mention up to ${maxMentions} users per message.`,
            });
            closeMenu();
            return;
          }
        }

        // Check if we've reached the unique product mention limit
        if (isProductMention && maxUniqueProductMentions !== undefined) {
          const currentMentionCount = countMentions('product');
          if (currentMentionCount >= maxUniqueProductMentions) {
            info({
              title: 'Product tag limit reached',
              content: `You can only tag up to ${DEFAULT_MAX_PRODUCTS} products per post.`,
            });
            closeMenu();
            return;
          }
        }

        const node = $createNode(selectedOption.data, selectedOption.key);
        const textNode = $createTextNode(' ');
        if (nodeToReplace) {
          $insertNodes([textNode]);
          textNode.insertBefore(nodeToReplace);
          nodeToReplace.replace(node);
        }
        textNode.select();
        closeMenu();
      });
    },
    [editor, maxMentions, maxUniqueProductMentions, info],
  );

  const checkForMentionMatch = useCallback(
    (text: string) => {
      return getPossibleQueryMatch(text);
    },
    [editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin
      anchorClassName={anchorClassName}
      onQueryChange={onQueryChange}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={menuRenderFn}
      commandPriority={commandPriority}
    />
  );
}
