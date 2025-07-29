import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  $getRoot,
  TextNode,
  $isElementNode,
} from 'lexical';
import { useEffect, useRef } from 'react';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import {
  $createHashtagNode,
  HashtagNode,
  $isHashtagNode,
} from '~/v4/social/internal-components/Lexical/nodes/HashtagNode';
import { $isLinkNode } from '@lexical/link';
import { hashtagRegex, hashtagTextRegex } from '~/v4/social/utils/hashtagRegex';

const MAX_HASHTAGS = 30; // Maximum number of hashtags allowed in the editor
const MAX_HASHTAG_LENGTH = 101; // Maximum characters in a hashtag (including #)

// Helper function to check if a text node is inside a link node
function $isTextNodeInsideLink(textNode: TextNode): boolean {
  let parent = textNode.getParent();
  while (parent) {
    if ($isLinkNode(parent)) {
      return true;
    }
    parent = parent.getParent();
  }
  return false;
}

function shouldSkipHashtagProcessing(textContent: string, hashtagMatch: RegExpExecArray): boolean {
  const hashtagIndex = hashtagMatch.index;

  // Check if there's a space immediately before the hashtag
  const charBeforeHashtag = hashtagIndex > 0 ? textContent[hashtagIndex - 1] : '';
  if (charBeforeHashtag === ' ') {
    // If there's a space before the hashtag, it should be treated as a separate hashtag
    return false;
  }

  // Comprehensive URL patterns to catch various URL formats with hashtags
  const urlPatterns = [
    // Standard URLs with protocols (no spaces allowed)
    /https?:\/\/[^\s]+/g,
    // URLs starting with www (no spaces allowed)
    /www\.[^\s]+/g,
    // URLs with fragments and query parameters (no spaces allowed)
    /((https?:\/\/)|(www\.))[a-zA-Z0-9@:%._+~#=?&/-]+/g,
    // Simple domain patterns that might contain hashtags (no spaces allowed)
    /[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s]*/g,
  ];

  // Check against all URL patterns
  for (const urlPattern of urlPatterns) {
    urlPattern.lastIndex = 0;
    let urlMatch;

    while ((urlMatch = urlPattern.exec(textContent)) !== null) {
      const urlStart = urlMatch.index;
      const urlEnd = urlStart + urlMatch[0].length;

      // If the hashtag is within any URL boundaries, skip processing
      if (hashtagIndex >= urlStart && hashtagIndex < urlEnd) {
        return true;
      }
    }
  }

  return false;
}

function countHashtags(): number {
  let count = 0;
  const root = $getRoot();

  function traverse(node: any) {
    if ($isHashtagNode(node)) {
      count++;
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

export function HashtagPlugin(): null {
  const [editor] = useLexicalComposerContext();
  const isTransformingRef = useRef(false);
  const hasShownLimitWarningRef = useRef(false);
  const { info } = useConfirmContext();

  useEffect(() => {
    const removeHashtagNodeTransform = editor.registerNodeTransform(HashtagNode, (node) => {
      if (isTransformingRef.current || !node.getParent() || !node.isAttached()) return;

      const textContent = node.getTextContent();
      if (!textContent.startsWith('#')) {
        editor.update(() => {
          if (node.getParent() && node.isAttached()) {
            isTransformingRef.current = true;
            try {
              node.replace($createTextNode(textContent));
            } finally {
              isTransformingRef.current = false;
            }
          }
        });
        return;
      }

      const nextSibling = node.getNextSibling();
      if (nextSibling && nextSibling.getType() === 'text' && !$isHashtagNode(nextSibling)) {
        const nextTextContent = nextSibling.getTextContent();
        const hashtagContinuation = nextTextContent.match(hashtagTextRegex);

        if (hashtagContinuation) {
          const currentHashtagCount = countHashtags();

          // Reset warning flag when hashtag count is below limit
          if (currentHashtagCount < MAX_HASHTAGS) {
            hasShownLimitWarningRef.current = false;
          }

          // Only show warning if we're actually exceeding the limit after this merge
          if (currentHashtagCount > MAX_HASHTAGS) {
            if (!hasShownLimitWarningRef.current) {
              hasShownLimitWarningRef.current = true;
              info({
                title: 'Hashtag limit reached',
                content: `You can only add hashtag up to ${MAX_HASHTAGS} hashtags per post.`,
              });
            }
            editor.update(() => {
              if (node.getParent() && node.isAttached()) {
                isTransformingRef.current = true;
                try {
                  node.replace($createTextNode(textContent));
                } finally {
                  isTransformingRef.current = false;
                }
              }
            });
            return;
          }

          const mergedText = textContent + hashtagContinuation[0];
          if (mergedText.length > MAX_HASHTAG_LENGTH) {
            const hashtagPart = mergedText.slice(0, MAX_HASHTAG_LENGTH);
            const remainingPart = mergedText.slice(MAX_HASHTAG_LENGTH);
            const remainingText = nextTextContent.slice(hashtagContinuation[0].length);

            if (hashtagPart !== textContent) {
              editor.update(() => {
                if (
                  node.getParent() &&
                  node.isAttached() &&
                  nextSibling &&
                  nextSibling.getParent() &&
                  nextSibling.isAttached()
                ) {
                  isTransformingRef.current = true;
                  try {
                    const newHashtagNode = $createHashtagNode({
                      text: hashtagPart,
                      hashtag: hashtagPart.slice(1),
                    });
                    node.replace(newHashtagNode);

                    const allRemainingText = remainingPart + remainingText;
                    if (allRemainingText) {
                      newHashtagNode.insertAfter($createTextNode(allRemainingText));
                    }
                    nextSibling.remove();
                  } finally {
                    isTransformingRef.current = false;
                  }
                }
              });
            }
            return;
          }

          if (mergedText !== textContent) {
            editor.update(() => {
              if (
                node.getParent() &&
                node.isAttached() &&
                nextSibling &&
                nextSibling.getParent() &&
                nextSibling.isAttached()
              ) {
                isTransformingRef.current = true;
                try {
                  const remainingText = nextTextContent.slice(hashtagContinuation[0].length);
                  const newHashtagNode = $createHashtagNode({
                    text: mergedText,
                    hashtag: mergedText.slice(1),
                  });
                  node.replace(newHashtagNode);

                  if (remainingText) {
                    newHashtagNode.insertAfter($createTextNode(remainingText));
                  }
                  nextSibling.remove();
                } finally {
                  isTransformingRef.current = false;
                }
              }
            });
          }
        }
      }
    });

    const textTransform = editor.registerNodeTransform(TextNode, (textNode) => {
      if (
        isTransformingRef.current ||
        !textNode.getParent() ||
        !textNode.isAttached() ||
        !textNode.isSimpleText() ||
        $isHashtagNode(textNode) ||
        (textNode.getParent() && $isHashtagNode(textNode.getParent())) ||
        $isTextNodeInsideLink(textNode)
      )
        return;

      const textContent = textNode.getTextContent();
      if (!textContent.includes('#')) return;

      editor.update(() => {
        if (!textNode.getParent() || !textNode.isAttached() || isTransformingRef.current) return;
        isTransformingRef.current = true;

        try {
          const nodes = [];
          let lastIndex = 0;
          const currentHashtagCount = countHashtags();

          if (currentHashtagCount < MAX_HASHTAGS) {
            hasShownLimitWarningRef.current = false;
          }

          hashtagRegex.lastIndex = 0;
          let match: RegExpExecArray | null;
          let hasShownWarningThisTransform = false;

          while ((match = hashtagRegex.exec(textContent)) !== null) {
            const [fullHashtagText] = match;
            const matchStart = match.index;
            const matchEnd = matchStart + fullHashtagText.length;

            if (shouldSkipHashtagProcessing(textContent, match)) {
              if (matchStart > lastIndex) {
                const beforeText = textContent.slice(lastIndex, matchStart);
                if (beforeText) {
                  nodes.push($createTextNode(beforeText));
                }
              }
              nodes.push($createTextNode(fullHashtagText));
              lastIndex = matchEnd;
              continue;
            }

            const limitedHashtagText =
              fullHashtagText.length > MAX_HASHTAG_LENGTH
                ? fullHashtagText.slice(0, MAX_HASHTAG_LENGTH)
                : fullHashtagText;
            const hashtagText = limitedHashtagText.slice(1);

            if (!hashtagTextRegex.test(hashtagText)) continue;

            if (matchStart > lastIndex) {
              const beforeText = textContent.slice(lastIndex, matchStart);
              if (beforeText) {
                nodes.push($createTextNode(beforeText));
              }
            }

            // Count only hashtags that will actually be processed (not in URLs)
            const actualHashtagCount =
              currentHashtagCount + nodes.filter((node) => $isHashtagNode(node)).length;

            if (actualHashtagCount >= MAX_HASHTAGS) {
              // Only show warning once per session when limit is exceeded
              if (!hasShownLimitWarningRef.current && !hasShownWarningThisTransform) {
                hasShownLimitWarningRef.current = true;
                hasShownWarningThisTransform = true;
                info({
                  title: 'Hashtag limit reached',
                  content: `You can only add hashtag up to ${MAX_HASHTAGS} hashtags per post.`,
                });
              }
              nodes.push($createTextNode(limitedHashtagText));
              if (fullHashtagText.length > MAX_HASHTAG_LENGTH) {
                nodes.push($createTextNode(fullHashtagText.slice(MAX_HASHTAG_LENGTH)));
              }
            } else {
              nodes.push(
                $createHashtagNode({
                  text: limitedHashtagText,
                  hashtag: hashtagText,
                }),
              );
              if (fullHashtagText.length > MAX_HASHTAG_LENGTH) {
                nodes.push($createTextNode(fullHashtagText.slice(MAX_HASHTAG_LENGTH)));
              }
            }
            lastIndex = matchEnd;
          }

          if (lastIndex < textContent.length) {
            const remainingText = textContent.slice(lastIndex);
            if (remainingText) {
              nodes.push($createTextNode(remainingText));
            }
          }

          if (nodes.length > 0 && textNode.getParent() && textNode.isAttached()) {
            const newContent = nodes.map((node) => node.getTextContent()).join('');
            if (newContent !== textContent || nodes.length > 1) {
              const selection = $getSelection();
              let selectionOffset = 0;
              let shouldRestoreSelection = false;

              if ($isRangeSelection(selection) && selection.anchor.getNode() === textNode) {
                selectionOffset = selection.anchor.offset;
                shouldRestoreSelection = true;
              }

              textNode.insertBefore(nodes[0]);
              for (let i = 1; i < nodes.length; i++) {
                nodes[i - 1].insertAfter(nodes[i]);
              }

              if (shouldRestoreSelection) {
                let offset = 0;
                let targetNode = null;
                let targetOffset = 0;

                for (const node of nodes) {
                  const nodeLength = node.getTextContent().length;
                  if (offset + nodeLength >= selectionOffset) {
                    targetNode = node;
                    targetOffset = Math.min(selectionOffset - offset, nodeLength);
                    break;
                  }
                  offset += nodeLength;
                }

                if (targetNode && targetNode.getParent() && targetNode.isAttached()) {
                  try {
                    targetNode.select(targetOffset, targetOffset);
                  } catch (error) {
                    const validNodes = nodes.filter((n) => n.getParent() && n.isAttached());
                    if (validNodes.length > 0) {
                      const lastValidNode = validNodes[validNodes.length - 1];
                      lastValidNode.select(
                        lastValidNode.getTextContent().length,
                        lastValidNode.getTextContent().length,
                      );
                    }
                  }
                }
              }

              if (textNode.getParent() && textNode.isAttached()) {
                textNode.remove();
              }
            }
          }
          hashtagRegex.lastIndex = 0;
        } finally {
          isTransformingRef.current = false;
        }
      });
    });

    return () => {
      removeHashtagNodeTransform();
      textTransform();
    };
  }, [editor, info]);
  return null;
}
