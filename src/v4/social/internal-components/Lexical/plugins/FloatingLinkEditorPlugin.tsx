import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useString } from '~/v4/core/localization';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  RangeSelection,
} from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { setFloatingElemPositionForLinkEditor } from '~/v4/social/internal-components/Lexical/utils';
import { $isMentionNode } from '~/v4/social/internal-components/Lexical/nodes/MentionNode';
import { $isHashtagNode } from '~/v4/social/internal-components/Lexical/nodes/HashtagNode';
import styles from './FloatingLinkEditorPlugin.module.css';
import { Link } from '~/v4/icons/Link';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import Check from '~/v4/icons/Check';
import CloseIcon from '~/v4/icons/Close';
import { isValidUrl } from '~/v4/social/utils/isValidUrl';
import Trash from '~/v4/social/icons/trash';

interface FloatingLinkEditorPluginProps {
  enabled?: boolean;
}

export const FloatingLinkEditorPlugin = ({ enabled = true }: FloatingLinkEditorPluginProps) => {
  const [editor] = useLexicalComposerContext();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [editedLinkUrl, setEditedLinkUrl] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [lastSelection, setLastSelection] = useState<RangeSelection | null>(null);
  const positionRef = useRef<DOMRect | null>(null);
  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typeOrPasteALinkLabel = useString('amity_social_type_or_paste_a_link');

  // If plugin is disabled, don't render anything
  if (!enabled) {
    return null;
  }

  const updateLinkEditor = useCallback(
    (skipDebounce = false) => {
      const selection = $getSelection();
      let hasLinkInSelection = false;
      let hasHashtagOrMentionInSelection = false;

      if ($isRangeSelection(selection)) {
        const selectedNodes = selection.getNodes();

        // Check if selection contains link nodes (embedded links)
        hasLinkInSelection = selectedNodes.some((node) => {
          const parent = node.getParent();
          return $isLinkNode(node) || $isLinkNode(parent);
        });

        // Check if selection contains hashtag or mention nodes
        hasHashtagOrMentionInSelection = selectedNodes.some((node) => {
          return $isHashtagNode(node) || $isMentionNode(node);
        });

        // Clone the selection to preserve it
        if (!selection.isCollapsed()) {
          setLastSelection(selection.clone());
        }
      }

      const editorElem = editorRef.current;
      const nativeSelection = window.getSelection();
      const activeElement = document.activeElement;

      if (editorElem === null) {
        return;
      }

      const rootElement = editor.getRootElement();
      const isLinkEditorActive = activeElement?.closest(`.${styles.linkEditor}`) !== null;

      // Get the container element (parent of root element or viewport)
      const containerElement = rootElement?.parentElement;

      // Clear any existing timeout
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }

      // Validate selection for link creation
      const isValidSelection = () => {
        if (!nativeSelection || nativeSelection.isCollapsed) return false;

        const selectedText = nativeSelection.toString();

        // 1. Don't allow if selection is only whitespace
        if (!selectedText.trim()) return false;

        // 2. Don't allow if selection includes newline
        if (selectedText.includes('\n')) return false;

        // 3. Don't allow if selection is more than 400 characters
        if (selectedText.length > 400) return false;

        // 4. Don't allow if selection contains hashtag or mention
        if (hasHashtagOrMentionInSelection) return false;

        return true;
      };

      // Only show "Add Link" button if there's a non-collapsed selection WITHOUT an existing link
      if (
        selection !== null &&
        nativeSelection !== null &&
        !nativeSelection.isCollapsed &&
        !hasLinkInSelection &&
        rootElement !== null &&
        rootElement.contains(nativeSelection.anchorNode) &&
        isValidSelection()
      ) {
        const domRect = nativeSelection.getRangeAt(0).getBoundingClientRect();
        if (domRect !== null) {
          positionRef.current = domRect;

          if (skipDebounce) {
            // Show immediately without debounce
            setFloatingElemPositionForLinkEditor(domRect, editorElem, containerElement);
            setIsEditMode(true);
          } else {
            // Don't show during selection, wait for mouseup
            return;
          }
        }
      } else if (isLinkEditorActive && positionRef.current) {
        // Keep the position while interacting with the link editor
        setFloatingElemPositionForLinkEditor(positionRef.current, editorElem, containerElement);
        setIsEditMode(true);
      } else {
        // Hide editor
        setFloatingElemPositionForLinkEditor(null, editorElem, containerElement);
        setIsEditMode(false);
        setShowInput(false);
        setEditedLinkUrl('');
        setLinkUrl('');
        positionRef.current = null;
      }

      return true;
    },
    [editor],
  );

  useEffect(() => {
    const scrollerElem = editor.getRootElement()?.parentElement;
    const rootElement = editor.getRootElement();

    const update = () => {
      editor.getEditorState().read(() => {
        updateLinkEditor();
      });
    };

    const handleMouseUp = () => {
      // When user finishes selecting, check if there's a valid selection
      const nativeSelection = window.getSelection();
      if (nativeSelection && !nativeSelection.isCollapsed) {
        // Small delay to ensure selection is finalized
        if (selectionTimeoutRef.current) {
          clearTimeout(selectionTimeoutRef.current);
        }

        selectionTimeoutRef.current = setTimeout(() => {
          editor.getEditorState().read(() => {
            updateLinkEditor(true);
          });
        }, 100);
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Find the closest <a> tag (could be the target itself or a parent)
      const linkElement = target.closest('a');

      // Check if we found a link element and it's within the editor
      if (linkElement && rootElement?.contains(linkElement)) {
        // Check if this is an AutoLink by comparing text content with href
        const linkText = linkElement.textContent || '';
        const linkHref = linkElement.getAttribute('href') || '';

        // If the text matches the href (ignoring protocol differences), it's an AutoLink
        // Don't show floating editor for AutoLinks
        const isAutoLink =
          linkText === linkHref || linkText === linkHref.replace(/^https?:\/\//, '');

        if (isAutoLink) {
          // Allow default behavior (open link) for AutoLinks
          return;
        }

        event.preventDefault();

        // Get the URL from the href attribute (not .href property which returns absolute URL)
        const url = linkElement.getAttribute('href') || '';

        // Get the position of the clicked link
        const linkRect = linkElement.getBoundingClientRect();
        positionRef.current = linkRect;

        // Set the link URL
        setLinkUrl(url);

        // Show the floating editor
        const editorElem = editorRef.current;
        const containerElement = rootElement?.parentElement;
        if (editorElem && containerElement) {
          setFloatingElemPositionForLinkEditor(linkRect, editorElem, containerElement);
          setIsEditMode(true);
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const editorElem = editorRef.current;
      const rootElement = editor.getRootElement();

      // If clicking outside both the link editor and the editor itself, hide it
      if (
        editorElem &&
        !editorElem.contains(target) &&
        rootElement &&
        !rootElement.contains(target) &&
        isEditMode
      ) {
        // Hide the floating editor
        const containerElement = rootElement?.parentElement;
        if (editorElem && containerElement) {
          setFloatingElemPositionForLinkEditor(null, editorElem, containerElement);
        }

        setIsEditMode(false);
        setShowInput(false);
        setEditedLinkUrl('');
        setLinkUrl('');
        positionRef.current = null;
      }
    };

    window.addEventListener('resize', update);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('click', handleClick);
    // Listen to mouseup on document to catch selections that end outside the editor
    document.addEventListener('mouseup', handleMouseUp);

    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update);
    }

    return () => {
      window.removeEventListener('resize', update);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mouseup', handleMouseUp);

      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update);
      }

      // Clean up timeout on unmount
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }
    };
  }, [editor, updateLinkEditor, isEditMode]);

  useEffect(() => {
    const removeUpdateListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateLinkEditor();
      });
    });

    const removeCommandListener = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateLinkEditor();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );

    return () => {
      removeUpdateListener();
      removeCommandListener();
    };
  }, [editor, updateLinkEditor]);

  const handleAddLinkClick = () => {
    setShowInput(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      const editorElem = editorRef.current;
      const rootElement = editor.getRootElement();
      const containerElement = rootElement?.parentElement;
      if (editorElem && positionRef.current && containerElement) {
        setFloatingElemPositionForLinkEditor(positionRef.current, editorElem, containerElement);
      }
    }, 0);
  };

  const handleLinkSubmit = () => {
    if (lastSelection !== null && editedLinkUrl !== '') {
      editor.update(() => {
        // Get the anchor and focus from the saved selection
        const anchorKey = lastSelection.anchor.key;
        const anchorOffset = lastSelection.anchor.offset;
        const focusKey = lastSelection.focus.key;
        const focusOffset = lastSelection.focus.offset;

        // Try to get current selection and set it to match the saved one
        const currentSelection = $getSelection();
        if ($isRangeSelection(currentSelection)) {
          currentSelection.anchor.set(anchorKey, anchorOffset, 'text');
          currentSelection.focus.set(focusKey, focusOffset, 'text');

          // Dispatch TOGGLE_LINK_COMMAND with the URL
          // The editorToText function will determine renderPreview based on text vs URL comparison
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, editedLinkUrl);
        }
      });
    }

    // Hide the floating editor
    const editorElem = editorRef.current;
    const rootElement = editor.getRootElement();
    const containerElement = rootElement?.parentElement;
    if (editorElem && containerElement) {
      setFloatingElemPositionForLinkEditor(null, editorElem, containerElement);
    }

    setIsEditMode(false);
    setShowInput(false);
    setEditedLinkUrl('');
    setLinkUrl('');
    positionRef.current = null;
  };

  const handleRemoveLink = () => {
    editor.update(() => {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    });
    setIsEditMode(false);
    setShowInput(false);
    setEditedLinkUrl('');
    setLinkUrl('');
  };

  return (
    <div ref={editorRef} className={styles.linkEditorContainer}>
      {linkUrl ? (
        <div className={styles.linkForm}>
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
            {linkUrl}
          </a>
          <Button
            type="button"
            variant="text"
            color="secondary"
            aria-label={useString('amity_social_button_remove_link')}
            className={styles.linkSaveBtn}
            onPress={handleRemoveLink}
          >
            <Trash className={styles.addLinkBtn__icon} />
          </Button>
        </div>
      ) : showInput ? (
        <div className={styles.linkForm}>
          <input
            autoFocus
            type="text"
            ref={inputRef}
            value={editedLinkUrl}
            placeholder={typeOrPasteALinkLabel}
            className={styles.linkInput}
            style={
              {
                '--input-length': editedLinkUrl.length,
              } as React.CSSProperties
            }
            data-valid={editedLinkUrl && isValidUrl(editedLinkUrl)}
            onChange={(e) => setEditedLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                setIsEditMode(false);
                setShowInput(false);
                setEditedLinkUrl('');
                positionRef.current = null;
              }
            }}
          />
          <Button
            type="button"
            variant="text"
            color="secondary"
            aria-label="Save link"
            onPress={handleLinkSubmit}
            className={styles.linkSaveBtn}
            isDisabled={!isValidUrl(editedLinkUrl)}
          >
            <Check className={styles.addLinkBtn__icon} />
          </Button>
          <Button
            type="button"
            variant="text"
            color="secondary"
            aria-label="clear link"
            className={styles.linkSaveBtn}
            onPress={() => {
              setTimeout(() => {
                const editorElem = editorRef.current;
                const rootElement = editor.getRootElement();
                const containerElement = rootElement?.parentElement;
                if (editorElem) {
                  setFloatingElemPositionForLinkEditor(null, editorElem, containerElement);
                }
                setIsEditMode(false);
                setShowInput(false);
                setEditedLinkUrl('');
                setLinkUrl('');
                positionRef.current = null;
              }, 0);
            }}
          >
            <CloseIcon className={styles.addLinkBtn__icon} />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="text"
          color="secondary"
          className={styles.addLinkBtn}
          onPress={handleAddLinkClick}
          aria-label={useString('amity_social_button_add_link')}
        >
          <Link className={styles.addLinkBtn__icon} />
          <Typography.CaptionBold>
            {useString('amity_social_button_add_link')}
          </Typography.CaptionBold>
        </Button>
      )}
    </div>
  );
};
