import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $createTextNode,
  $isTextNode,
  $isLineBreakNode,
  $isElementNode,
  TextNode,
  COMMAND_PRIORITY_HIGH,
  PASTE_COMMAND,
} from 'lexical';
import { $createLinkNode, $isLinkNode, $isAutoLinkNode, LinkNode } from '@lexical/link';
import { URL_REGEX } from '~/v4/social/constants/post';

/**
 * Lexical's AutoLinkPlugin uses PUNCTUATION_OR_SPACE = /[.,;\s]/ as its separator check.
 * URL matches where the next character isn't in that set are rejected.
 * This plugin supplements AutoLinkPlugin by handling those rejected matches.
 */
const LEXICAL_SEPARATOR = /[.,;\s]/;

function wouldAutoLinkPluginHandle(matchEnd: number, text: string, node: TextNode): boolean {
  if (matchEnd < text.length) {
    return LEXICAL_SEPARATOR.test(text[matchEnd]);
  }
  // matchEnd === text.length → AutoLinkPlugin checks isNextNodeValid
  let nextNode = node.getNextSibling();
  if ($isElementNode(nextNode)) {
    nextNode = nextNode.getFirstDescendant();
  }
  if (nextNode === null || $isLineBreakNode(nextNode)) return true;
  if ($isTextNode(nextNode)) {
    const nextText = nextNode.getTextContent();
    return nextText.length > 0 && LEXICAL_SEPARATOR.test(nextText[0]);
  }
  return false;
}

export function LinkValidationPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // 1. Intercept paste — force plain text to strip all HTML link formatting.
    //    AutoLinkPlugin + our TextNode transform below will re-detect valid URLs.
    const removePasteCommand = editor.registerCommand(
      PASTE_COMMAND,
      (event: ClipboardEvent) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        const hasHtml = clipboardData.getData('text/html');
        if (!hasHtml) return false;

        const plainText = clipboardData.getData('text/plain');
        event.preventDefault();

        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertRawText(plainText);
          }
        });

        return true;
      },
      COMMAND_PRIORITY_HIGH,
    );

    // 2. Supplement AutoLinkPlugin for URL matches it rejects due to narrow separator check.
    //    Creates LinkNode (not AutoLinkNode) so handleLinkEdit won't auto-remove them.
    const removeTextTransform = editor.registerNodeTransform(TextNode, (node) => {
      if (!node.isSimpleText()) return;

      const parent = node.getParent();
      if ($isLinkNode(parent) || $isAutoLinkNode(parent)) return;

      const text = node.getTextContent();
      if (!text) return;

      URL_REGEX.lastIndex = 0;
      const match = URL_REGEX.exec(text);
      if (!match) return;

      const matchStart = match.index;
      const matchEnd = matchStart + match[0].length;

      // If AutoLinkPlugin would handle this match (separator after match), skip.
      // If AutoLinkPlugin already handled it, the text node is gone and we won't reach here.
      if (wouldAutoLinkPluginHandle(matchEnd, text, node)) {
        return;
      }

      // If the character after the match is ( or ), the regex stopped due to unbalanced
      // parentheses. The user likely intended the whole thing as one URL (e.g. "http://example.com/path(1").
      // Since it's invalid, reject the partial match entirely — don't create a link.
      if (matchEnd < text.length && /[()]/.test(text[matchEnd])) {
        return;
      }

      const url =
        match[0].startsWith('http') || match[0].startsWith('ftp') || match[0].startsWith('mailto')
          ? match[0]
          : `https://${match[0]}`;

      // Split text node at match boundaries and create LinkNode
      let linkTextNode: TextNode;

      if (matchStart === 0) {
        if (matchEnd < text.length) {
          [linkTextNode] = node.splitText(matchEnd);
        } else {
          linkTextNode = node;
        }
      } else {
        if (matchEnd < text.length) {
          const parts = node.splitText(matchStart, matchEnd);
          linkTextNode = parts[1];
        } else {
          const parts = node.splitText(matchStart);
          linkTextNode = parts[1];
        }
      }

      const linkNode = $createLinkNode(url);
      const newTextNode = $createTextNode(match[0]);
      newTextNode.setFormat(linkTextNode.getFormat());
      newTextNode.setDetail(linkTextNode.getDetail());
      newTextNode.setStyle(linkTextNode.getStyle());
      linkNode.append(newTextNode);
      linkTextNode.replace(linkNode);
    });

    // 3. Maintain auto-detected LinkNodes: remove link if text no longer matches URL_REGEX.
    const removeLinkTransform = editor.registerNodeTransform(LinkNode, (node) => {
      if ($isAutoLinkNode(node)) return;

      const url = node.getURL();
      const textContent = node.getTextContent();

      // Only manage "auto-link style" LinkNodes (text ≈ URL)
      const isAutoLinkStyle =
        textContent === url ||
        textContent === url.replace(/^https?:\/\//, '') ||
        url === `https://${textContent}` ||
        url === `http://${textContent}`;

      if (!isAutoLinkStyle) return; // User-created embedded link, leave it alone

      // If text no longer matches URL_REGEX, unwrap the link
      const fullMatchRegex = new RegExp(`^${URL_REGEX.source}$`);
      if (!fullMatchRegex.test(textContent)) {
        const children = node.getChildren();
        for (const child of children) {
          node.insertBefore(child);
        }
        node.remove();
      }
    });

    return () => {
      removePasteCommand();
      removeTextTransform();
      removeLinkTransform();
    };
  }, [editor]);

  return null;
}
