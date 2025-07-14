import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './MessageComposer.module.css';
import {
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  Klass,
  LexicalEditor,
  LexicalNode,
} from 'lexical';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { MentionPlugin } from '~/v4/social/internal-components/Lexical/plugins/MentionPlugin';
import { getEditorConfig, MentionData } from '~/v4/social/internal-components/Lexical/utils';
import {
  $createMentionNode,
  MentionNode,
} from '~/v4/social/internal-components/Lexical/nodes/MentionNode';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '~/v4/social/internal-components/Lexical/plugins/LinkPlugin';
import { AutoLinkPlugin } from '~/v4/social/internal-components/Lexical/plugins/AutoLinkPlugin';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';
import { EnterKeyInterceptorPlugin } from '~/v4/social/internal-components/Lexical/plugins/EnterKeyInterceptorPlugin';
import { AllMentionItem } from '~/v4/social/internal-components/Lexical/AllMentionItem';
import { MentionItem } from '~/v4/social/internal-components/Lexical/MentionItem';
import { CharacterLimitPlugin } from '~/v4/social/internal-components/Lexical/plugins/CharacterLimitPlugin';
import { PasteLimitPlugin } from '~/v4/social/internal-components/Lexical/plugins/PasteLimitPlugin';
import { EditorTextCheckerPlugin } from '~/v4/social/internal-components/Lexical/plugins/EditorTextChekerPlugin';
import { useChannelMentionSuggestion } from '~/v4/chat/hooks/useChannelMentionSuggestion';
import clsx from 'clsx';

const COMPOSEBAR_MAX_CHARACTER_LIMIT = 200;

export type ComposeActionTypes = {
  replyMessage?: Amity.Message;
  mentionMessage?: Amity.Message;
  clearReplyMessage?: () => void;
  clearMention?: () => void;
};

interface MessageComposerProps {
  composeAction?: ComposeActionTypes;
  disabled?: boolean;
  pageId?: string;
  componentId?: string;
  isMentionSupport?: boolean;
  isReplySupport?: boolean;
  maxLines?: number;
  maxCharactor?: number;
  allowEnterNewLine?: boolean;
  enterToSendMessage?: boolean;
  scrollable?: boolean;
  setIsEmpty?: (empty: boolean) => void;
  setIsSpacebar?: (spacebar: boolean) => void;
  onEnter?: () => void;
}

const nodes = [AutoLinkNode, LinkNode, MentionNode] as Array<Klass<LexicalNode>>;

export const MessageComposer = forwardRef<LexicalEditor, MessageComposerProps>(
  (
    {
      pageId = '*',
      componentId = '*',
      maxLines = 5,
      isMentionSupport = true,
      maxCharactor = COMPOSEBAR_MAX_CHARACTER_LIMIT,
      allowEnterNewLine = true,
      enterToSendMessage = false,
      disabled = false,
      scrollable = true,
      setIsEmpty,
      setIsSpacebar,
      onEnter,
    },
    ref,
  ) => {
    const optionsRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<LexicalEditor | null>(null);
    const elementId = 'message_composer';

    const { themeStyles, uiReference, config, accessibilityId } = useAmityElement({
      pageId,
      componentId,
      elementId,
    });

    const { onQueryChange, suggestions } = useChannelMentionSuggestion();

    const editorConfig = getEditorConfig({
      namespace: uiReference,
      editable: !disabled,
      theme: {
        root: styles.editorRoot,
        placeholder: styles.editorPlaceholder,
        paragraph: clsx(
          styles.editorParagraph,
          maxLines === 1 && scrollable === false ? styles.editorParagraph__oneLine : '',
        ),
        link: styles.editorLink,
      },
      nodes,
    });

    useImperativeHandle(ref, () => editorRef.current!, [editorRef.current]);

    useEffect(() => {
      if (editorRef) {
        editorRef.current?.setEditable(!disabled);
      }
    }, [disabled]);

    return (
      <div style={themeStyles} data-testid={accessibilityId}>
        <div ref={optionsRef} className={styles.optionContainer}></div>
        <div
          className={styles.editorContainer}
          style={
            {
              '--asc-max-lines': maxLines,
            } as React.CSSProperties
          }
        >
          <LexicalComposer initialConfig={editorConfig}>
            <RichTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={
                <span className={styles.editorPlaceholder}>
                  {config.placeholder_text ?? 'Chat...'}
                </span>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <LinkPlugin />
            <AutoLinkPlugin />
            <EditorRefPlugin editorRef={editorRef} />
            <EnterKeyInterceptorPlugin
              allowEnterNewLine={allowEnterNewLine}
              allowEnterToSend={enterToSendMessage}
              onEnter={() => onEnter?.()}
              commandPriority={COMMAND_PRIORITY_LOW}
            />
            <CharacterLimitPlugin maxCharactor={maxCharactor} />
            <PasteLimitPlugin maxCharactor={maxCharactor} />
            <EditorTextCheckerPlugin setIsEmpty={setIsEmpty} setIsSpacebar={setIsSpacebar} />

            {isMentionSupport && (
              <MentionPlugin<MentionData, MentionNode<MentionData>>
                suggestions={suggestions}
                getSuggestionId={(suggestion) => suggestion.userId}
                onQueryChange={onQueryChange}
                $createNode={(data) =>
                  $createMentionNode({
                    text: `@${data.displayName || ''}`,
                    data,
                  })
                }
                menuRenderFn={(
                  _,
                  { options, selectedIndex, setHighlightedIndex, selectOptionAndCleanUp },
                ) => {
                  if (!optionsRef.current || options.length === 0) {
                    return null;
                  }
                  return ReactDOM.createPortal(
                    <>
                      {options.map((option, i: number) => {
                        if (option.data.userId === 'all') {
                          return (
                            <AllMentionItem
                              isSelected={selectedIndex === i}
                              onClick={() => {
                                setHighlightedIndex(i);
                                selectOptionAndCleanUp(option);
                              }}
                              onMouseEnter={() => {
                                setHighlightedIndex(i);
                              }}
                              key={option.key}
                              option={option}
                            />
                          );
                        }

                        return (
                          <MentionItem
                            isSelected={selectedIndex === i}
                            onClick={() => {
                              setHighlightedIndex(i);
                              selectOptionAndCleanUp(option);
                            }}
                            onMouseEnter={() => {
                              setHighlightedIndex(i);
                            }}
                            key={option.key}
                            option={option}
                          />
                        );
                      })}
                    </>,
                    optionsRef.current,
                  );
                }}
                commandPriority={COMMAND_PRIORITY_HIGH}
              />
            )}
          </LexicalComposer>
        </div>
      </div>
    );
  },
);

export default MessageComposer;
