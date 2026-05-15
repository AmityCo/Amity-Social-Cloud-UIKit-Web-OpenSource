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
      if ($isAutoLinkNode(parent)) return;

      // When a TextNode inside an auto-link-style LinkNode changes, sync the URL.
      // registerNodeTransform(LinkNode) only fires when the LinkNode itself is dirty,
      // NOT when only its child TextNode is dirty (leaf mutation). So URL sync must
      // happen here in the TextNode transform.
      if ($isLinkNode(parent)) {
        const textContent = parent.getTextContent();
        const url = parent.getURL();

        const isAutoLinkStyle =
          textContent === url ||
          textContent === url.replace(/^https?:\/\//, '') ||
          url === `https://${textContent}` ||
          url === `http://${textContent}` ||
          url.startsWith(`https://${textContent}`) ||
          url.startsWith(`http://${textContent}`) ||
          url.startsWith(textContent);

        if (isAutoLinkStyle) {
          URL_REGEX.lastIndex = 0;
          const fullMatchRegex = new RegExp(`^${URL_REGEX.source}$`);
          const isValidUrl = fullMatchRegex.test(textContent);

          if (!isValidUrl) {
            // Text no longer a valid URL — unwrap the link
            const children = parent.getChildren();
            for (const child of children) {
              parent.insertBefore(child);
            }
            parent.remove();
          } else {
            // Keep URL in sync with the edited text
            const newUrl =
              textContent.startsWith('http') ||
              textContent.startsWith('ftp') ||
              textContent.startsWith('mailto')
                ? textContent
                : `https://${textContent}`;
            if (parent.getURL() !== newUrl) {
              parent.setURL(newUrl);
            }
          }
        }
        return;
      }

      const text = node.getTextContent();
      if (!text) return;

      // Extend previous auto-link-style LinkNode/AutoLinkNode if the new text continues the URL.
      // LinkNode.canInsertTextAfter() === false, so chars typed at the end of a link
      // land in a sibling TextNode. Merge them back into the link when they extend the URL.
      const prevSibling = node.getPreviousSibling();
      if ($isLinkNode(prevSibling)) {
        const linkText = prevSibling.getTextContent();
        const linkUrl = prevSibling.getURL();

        const isAutoLinkStyle =
          linkText === linkUrl ||
          linkText === linkUrl.replace(/^https?:\/\//, '') ||
          linkUrl === `https://${linkText}` ||
          linkUrl === `http://${linkText}` ||
          // Handle stale URL: chars were deleted from inside the link but the URL attribute
          // wasn't updated yet. The stored URL starts with the current (shortened) link text.
          linkUrl.startsWith(`https://${linkText}`) ||
          linkUrl.startsWith(`http://${linkText}`);

        if (isAutoLinkStyle) {
          const combined = linkText + text;
          URL_REGEX.lastIndex = 0;
          const extMatch = URL_REGEX.exec(combined);

          if (extMatch && extMatch.index === 0 && extMatch[0].length > linkText.length) {
            if ($isAutoLinkNode(prevSibling)) {
              // For AutoLinkNode: unwrap back to plain text and merge with the new TextNode.
              // AutoLinkPlugin owns AutoLinkNode state — mutating it directly causes
              // handleLinkEdit to revert our changes afterward.
              // Unwrapping hands the merged text back to AutoLinkPlugin so it re-detects
              // the full URL from scratch and builds a correct AutoLinkNode.
              const autoLinkChildren = prevSibling.getChildren();
              for (const child of autoLinkChildren) {
                prevSibling.insertBefore(child);
              }
              prevSibling.remove();

              const prevTextNode = node.getPreviousSibling();
              if ($isTextNode(prevTextNode)) {
                prevTextNode.setTextContent(prevTextNode.getTextContent() + text);
                node.remove();
              }
              return;
            }

            // For our custom LinkNode (not AutoLinkNode): extend in place.
            // AutoLinkPlugin doesn't manage LinkNode, so direct mutation is safe.
            const extensionLen = extMatch[0].length - linkText.length;
            const extensionText = text.slice(0, extensionLen);
            const remaining = text.slice(extensionLen);

            const newFullText = extMatch[0];
            const newUrl =
              newFullText.startsWith('http') ||
              newFullText.startsWith('ftp') ||
              newFullText.startsWith('mailto')
                ? newFullText
                : `https://${newFullText}`;

            prevSibling.setURL(newUrl);

            const linkChild = prevSibling.getLastDescendant();
            if ($isTextNode(linkChild)) {
              const newOffset = linkChild.getTextContent().length + extensionText.length;
              linkChild.setTextContent(linkChild.getTextContent() + extensionText);

              if (remaining.length > 0) {
                node.setTextContent(remaining);
              } else {
                node.remove();
              }
              linkChild.select(newOffset, newOffset);
            } else {
              const newChild = $createTextNode(extensionText);
              prevSibling.append(newChild);
              if (remaining.length > 0) {
                node.setTextContent(remaining);
              } else {
                node.remove();
              }
              newChild.select(extensionText.length, extensionText.length);
            }
            return;
          }
        }
      }

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
      // Also covers stale-URL case: the url attribute wasn't updated when chars were deleted,
      // so the stored URL may still start with the current (shorter) text.
      const isAutoLinkStyle =
        textContent === url ||
        textContent === url.replace(/^https?:\/\//, '') ||
        url === `https://${textContent}` ||
        url === `http://${textContent}` ||
        url.startsWith(`https://${textContent}`) ||
        url.startsWith(`http://${textContent}`) ||
        url.startsWith(textContent);

      if (!isAutoLinkStyle) return; // User-created embedded link, leave it alone

      // If text no longer matches URL_REGEX, unwrap the link
      const fullMatchRegex = new RegExp(`^${URL_REGEX.source}$`);
      const isValidUrl = fullMatchRegex.test(textContent);
      if (!isValidUrl) {
        const children = node.getChildren();
        for (const child of children) {
          node.insertBefore(child);
        }
        node.remove();
      } else {
        // Text is still a valid URL but may have been edited inside the link — keep URL in sync.
        // Without this, the stored URL becomes stale (e.g. still 'https://www.google.com'
        // after deleting '.com' and typing '.c'), breaking the isAutoLinkStyle checks
        // in the TextNode transform when the user types after the link.
        const newUrl =
          textContent.startsWith('http') ||
          textContent.startsWith('ftp') ||
          textContent.startsWith('mailto')
            ? textContent
            : `https://${textContent}`;
        if (node.getURL() !== newUrl) {
          node.setURL(newUrl);
        }
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
