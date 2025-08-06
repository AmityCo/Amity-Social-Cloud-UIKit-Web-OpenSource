import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  $getRoot,
  TextNode,
  $isElementNode,
  COMMAND_PRIORITY_LOW,
  KEY_ENTER_COMMAND,
} from 'lexical';
import { useEffect, useRef } from 'react';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import {
  $createHashtagNode,
  HashtagNode,
  $isHashtagNode,
} from '~/v4/social/internal-components/Lexical/nodes/HashtagNode';
import { $isLinkNode } from '@lexical/link';
import {
  hashtagRegex,
  hashtagTextRegex,
  MAX_HASHTAG_LENGTH,
  MAX_HASHTAGS,
} from '~/v4/social/utils/hashtagRegex';

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

// Function to trigger immediate hashtag transformation
function $transformHashtagsInSelection(
  checkAndUpdateWarningState: (count: number) => boolean,
  showHashtagLimitWarning: () => void,
): void {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return;

  const anchor = selection.anchor;
  const anchorNode = anchor.getNode();

  if (anchorNode.getType() === 'text' && !$isTextNodeInsideLink(anchorNode as TextNode)) {
    const textNode = anchorNode as TextNode;
    const textContent = textNode.getTextContent();
    const anchorOffset = anchor.offset;

    // Look for potential hashtag at cursor position in the full text content
    // Use regex to find hashtags that match our pattern
    hashtagRegex.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = hashtagRegex.exec(textContent)) !== null) {
      const fullMatch = match[0]; // includes any leading whitespace
      const hashtagText = match[1]; // just the hashtag content without #
      const matchStart = match.index;

      // Check if the match starts with whitespace only when hashtag isn't at start (index ≠ 0)
      const startsWithWhitespace = matchStart !== 0 && /^\s/.test(fullMatch);
      const hashtagStart = startsWithWhitespace ? matchStart + 1 : matchStart; // adjust for leading whitespace
      const hashtagEnd = hashtagStart + hashtagText.length + 1; // +1 for the #
      const fullHashtagText = '#' + hashtagText;

      // Check if this hashtag is part of a consecutive hashtag sequence
      // If the previous character before this hashtag (excluding whitespace) is #, skip this hashtag
      const textBeforeHashtag = textContent.slice(0, hashtagStart);
      let lastNonWhitespaceChar = '';
      for (let i = textBeforeHashtag.length - 1; i >= 0; i--) {
        if (textBeforeHashtag[i] !== ' ' && textBeforeHashtag[i] !== '\t') {
          lastNonWhitespaceChar = textBeforeHashtag[i];
          break;
        }
      }

      // If the last non-whitespace character before this hashtag is #, skip transformation
      if (lastNonWhitespaceChar === '#') {
        continue;
      }

      // Only transform if the cursor is at or near the end of this hashtag
      if (hashtagEnd >= anchorOffset - 1 && hashtagEnd <= anchorOffset) {
        if (hashtagTextRegex.test(hashtagText)) {
          const currentHashtagCount = countHashtags();

          // Check if we can add another hashtag or if we should show warning
          if (currentHashtagCount < MAX_HASHTAGS) {
            const limitedHashtagText =
              fullHashtagText.length > MAX_HASHTAG_LENGTH + 1 // +1 to account for '#'
                ? fullHashtagText.slice(0, MAX_HASHTAG_LENGTH + 1) // +1 to account for '#'
                : fullHashtagText;
            const limitedHashtagPureText = limitedHashtagText.slice(1);

            // Split the text node
            const beforeText = textContent.slice(0, hashtagStart);
            const afterText = textContent.slice(hashtagEnd);

            const nodes = [];

            if (beforeText) {
              nodes.push($createTextNode(beforeText));
            }

            nodes.push(
              $createHashtagNode({
                text: limitedHashtagText,
                hashtag: limitedHashtagPureText,
              }),
            );

            if (fullHashtagText.length > MAX_HASHTAG_LENGTH + 1) {
              // +1 to account for '#'
              const remainingText = fullHashtagText.slice(MAX_HASHTAG_LENGTH + 1) + afterText;
              if (remainingText) {
                nodes.push($createTextNode(remainingText));
              }
            } else if (afterText) {
              nodes.push($createTextNode(afterText));
            }

            // Replace the text node with new nodes
            if (nodes.length > 0) {
              textNode.insertBefore(nodes[0]);
              for (let i = 1; i < nodes.length; i++) {
                nodes[i - 1].insertAfter(nodes[i]);
              }

              // Update selection to be after the hashtag
              const hashtagNode = nodes.find((node) => $isHashtagNode(node));
              if (hashtagNode) {
                hashtagNode.select();
              }

              textNode.remove();
            }
            break; // Only transform the first matching hashtag
          } else {
            // Check if we should show the warning
            if (checkAndUpdateWarningState(currentHashtagCount)) {
              showHashtagLimitWarning();
            }
          }
        }
      }
    }

    hashtagRegex.lastIndex = 0;
  }
}

export function HashtagPlugin(): null {
  const [editor] = useLexicalComposerContext();
  const isTransformingRef = useRef(false);
  const hasShownLimitWarningRef = useRef(false);
  const lastHashtagCountRef = useRef(0);
  const { info } = useConfirmContext();

  // Helper function to check if we should show the warning and update the warning state
  const checkAndUpdateWarningState = (currentCount: number): boolean => {
    // If we go below the limit, reset the warning flag
    if (currentCount < MAX_HASHTAGS) {
      hasShownLimitWarningRef.current = false;
    }

    // Update the last known count
    lastHashtagCountRef.current = currentCount;

    // Return whether we should show the warning
    return currentCount >= MAX_HASHTAGS && !hasShownLimitWarningRef.current;
  };

  const showHashtagLimitWarning = (): void => {
    hasShownLimitWarningRef.current = true;
    info({
      title: 'Hashtag limit reached',
      content: `You can only add hashtag up to ${MAX_HASHTAGS} hashtags per post.`,
    });
  };

  useEffect(() => {
    // Register enter command to trigger hashtag transformation
    const removeEnterCommand = editor.registerCommand(
      KEY_ENTER_COMMAND,
      () => {
        editor.update(() => {
          if (!isTransformingRef.current) {
            isTransformingRef.current = true;
            try {
              $transformHashtagsInSelection(checkAndUpdateWarningState, showHashtagLimitWarning);
            } finally {
              isTransformingRef.current = false;
            }
          }
        });
        return false; // Don't prevent default enter behavior
      },
      COMMAND_PRIORITY_LOW,
    );

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

          // Check if we should show the warning and update the state
          if (
            checkAndUpdateWarningState(currentHashtagCount) &&
            currentHashtagCount > MAX_HASHTAGS
          ) {
            showHashtagLimitWarning();
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
          if (mergedText.length > MAX_HASHTAG_LENGTH + 1) {
            // +1 to account for '#'
            const hashtagPart = mergedText.slice(0, MAX_HASHTAG_LENGTH + 1); // +1 to account for '#'
            const remainingPart = mergedText.slice(MAX_HASHTAG_LENGTH + 1); // +1 to account for '#'
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

    // Re-enable text transformation with proper hashtag detection
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

          // Check and update warning state based on current count
          checkAndUpdateWarningState(currentHashtagCount);

          hashtagRegex.lastIndex = 0;
          let match: RegExpExecArray | null;
          let hasShownWarningThisTransform = false;

          while ((match = hashtagRegex.exec(textContent)) !== null) {
            const fullMatch = match[0]; // includes any leading whitespace
            const hashtagText = match[1]; // just the hashtag content without #
            const matchStart = match.index;
            const matchEnd = matchStart + fullMatch.length;

            // Check if the match starts with whitespace only when hashtag isn't at start (index ≠ 0)
            const startsWithWhitespace = matchStart !== 0 && /^\s/.test(fullMatch);
            const hashtagStart = startsWithWhitespace ? matchStart + 1 : matchStart; // adjust for leading whitespace
            const fullHashtagText = '#' + hashtagText;

            if (!hashtagTextRegex.test(hashtagText)) continue;

            // Check if this hashtag is part of a consecutive hashtag sequence
            // If the previous character before this hashtag (excluding whitespace) is #, skip this hashtag
            const textBeforeHashtag = textContent.slice(0, hashtagStart);
            const lastNonWhitespaceChar = textBeforeHashtag.replace(/\s+$/, '').slice(-1);

            // If the last non-whitespace character before this hashtag is #, treat this as plain text
            if (lastNonWhitespaceChar === '#') {
              // Add the full hashtag text as plain text and continue
              if (hashtagStart > lastIndex) {
                const beforeText = textContent.slice(lastIndex, hashtagStart);
                if (beforeText) {
                  nodes.push($createTextNode(beforeText));
                }
              }
              nodes.push($createTextNode(fullHashtagText));
              lastIndex = matchEnd;
              continue;
            }

            // Add text before this hashtag
            if (hashtagStart > lastIndex) {
              const beforeText = textContent.slice(lastIndex, hashtagStart);
              if (beforeText) {
                nodes.push($createTextNode(beforeText));
              }
            }

            // Count only hashtags that will actually be processed
            const actualHashtagCount =
              currentHashtagCount + nodes.filter((node) => $isHashtagNode(node)).length;

            const shouldShowHashtagLimitWarning =
              actualHashtagCount === MAX_HASHTAGS &&
              !hasShownWarningThisTransform &&
              checkAndUpdateWarningState(actualHashtagCount);

            if (actualHashtagCount >= MAX_HASHTAGS) {
              // Check if we should show the warning for this attempt to exceed the limit
              if (shouldShowHashtagLimitWarning) {
                hasShownWarningThisTransform = true;
                showHashtagLimitWarning();
              }
              nodes.push($createTextNode(fullHashtagText));
            } else {
              const limitedHashtagText =
                fullHashtagText.length > MAX_HASHTAG_LENGTH + 1 // +1 to account for '#'
                  ? fullHashtagText.slice(0, MAX_HASHTAG_LENGTH + 1) // +1 to account for '#'
                  : fullHashtagText;
              const limitedHashtagPureText = limitedHashtagText.slice(1);

              nodes.push(
                $createHashtagNode({
                  text: limitedHashtagText,
                  hashtag: limitedHashtagPureText,
                }),
              );

              if (fullHashtagText.length > MAX_HASHTAG_LENGTH + 1) {
                // +1 to account for '#'
                nodes.push($createTextNode(fullHashtagText.slice(MAX_HASHTAG_LENGTH + 1)));
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
      removeEnterCommand();
      removeHashtagNodeTransform();
      textTransform();
    };
  }, [editor, info]);
  return null;
}
