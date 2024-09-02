import React, { RefObject, useCallback, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { MessageRepository } from '@amityco/ts-sdk';
import ArrowTop from '~/v4/icons/ArrowTop';
import { HomeIndicator } from '~/v4/chat/internal-components/HomeIndicator';
import { useChannelPermission } from '~/v4/chat/hooks/useChannelPermission';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useLiveChatNotifications } from '~/v4/chat/providers/LiveChatNotificationProvider';
import { useAmityComponent } from '~/v4/core/hooks/uikit';

import styles from './MessageComposer.module.css';
import { useSearchChannelUser } from '~/v4/chat/hooks/collections/useSearchChannelUser';
import {
  $getRoot,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  Klass,
  LexicalEditor,
  LexicalNode,
} from 'lexical';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { MentionPlugin } from '~/v4/social/internal-components/Lexical/plugins/MentionPlugin';

import { useMutation } from '@tanstack/react-query';
import {
  editorStateToText,
  getEditorConfig,
  MentionData,
} from '~/v4/social/internal-components/Lexical/utils';
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

const COMPOSEBAR_MAX_CHARACTER_LIMIT = 200;

type ComposeActionTypes = {
  replyMessage?: Amity.Message;
  mentionMessage?: Amity.Message;
  clearReplyMessage?: () => void;
  clearMention?: () => void;
};

interface MessageComposerProps {
  channel: Amity.Channel;
  composeAction: ComposeActionTypes;
  suggestionRef?: RefObject<HTMLDivElement>;
  disabled?: boolean;
  pageId?: string;
}

const useSuggestions = (channelId?: string | null) => {
  const [queryString, setQueryString] = useState<string | null>(null);

  const { isModerator } = useChannelPermission(channelId || undefined);

  const { channelMembers } = useSearchChannelUser({
    search: queryString,
    channelId: channelId as string,
    memberships: ['member'],
    limit: 20,
  });

  const onQueryChange = (newQuery: string | null) => {
    setQueryString(newQuery);
  };

  const suggestions = useMemo(() => {
    const baseSuggestion = channelMembers.map(({ user, userId }) => ({
      userId: user?.userId || userId,
      displayName: user?.displayName,
    }));

    return isModerator && (queryString === '' || /^al*l*$/i.test(queryString || ''))
      ? [{ userId: 'all', displayName: 'All' }, ...baseSuggestion]
      : baseSuggestion;
  }, [isModerator, channelMembers]);

  return { suggestions, queryString, onQueryChange };
};

const nodes = [AutoLinkNode, LinkNode, MentionNode] as Array<Klass<LexicalNode>>;

export const MessageComposer = ({
  pageId = '*',
  channel,
  composeAction: { replyMessage, mentionMessage, clearReplyMessage, clearMention },
}: MessageComposerProps) => {
  const componentId = 'message_composer';

  const optionsRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<LexicalEditor | null>(null);
  const { themeStyles, uiReference, config, accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

  const { confirm } = useConfirmContext();
  const notification = useLiveChatNotifications();

  const { onQueryChange, suggestions } = useSuggestions(channel.channelId);

  const { mutateAsync } = useMutation({
    mutationFn: (params: Parameters<typeof MessageRepository.createMessage>[0]) => {
      return MessageRepository.createMessage(params);
    },
    onSuccess: () => {
      editorRef.current?.update(() => {
        const root = $getRoot();
        root.clear();
      });

      clearReplyMessage && clearReplyMessage();
    },
    onError: (error) => {
      const errorMessage = error.message;
      let notificationMessage = "Your message wasn't sent. Please try again.";

      if (errorMessage === 'Amity SDK (400308): Text contain blocked word') {
        notificationMessage = "Your message wasn't sent as it contains a blocked word.";
      } else if (
        errorMessage === 'Amity SDK (400309): Data contain link that is not in whitelist'
      ) {
        notificationMessage = 'Your message wasn’t sent as it contained a link that’s not allowed.';
      } else if (errorMessage === 'Amity SDK (400302): User is muted') {
        notificationMessage = 'User is muted';
      }

      notification.error({
        content: notificationMessage,
      });
    },
  });

  const sendMessage = () => {
    if (!channel) return;
    if (!editorRef.current) return;

    const { mentioned, mentionees, text } = editorStateToText(editorRef.current);

    if (text?.trim().length === 0) return;

    if (text.trim().length > (config?.message_limit || COMPOSEBAR_MAX_CHARACTER_LIMIT)) {
      confirm({
        title: 'Unable to send message',
        content: 'Your message is too long. Please shorten your message and try again.',
        okText: 'Ok',
      });
      return;
    }

    mutateAsync({
      tags: [],
      subChannelId: channel.channelId,
      data: { text: text.trim() },
      dataType: 'text',
      mentionees,
      metadata: { mentioned },
      parentId: replyMessage?.messageId || undefined,
    });
  };

  const editorConfig = getEditorConfig({
    namespace: uiReference,
    theme: {
      root: styles.editorRoot,
      placeholder: styles.editorPlaceholder,
      paragraph: styles.editorParagraph,
      link: styles.editorLink,
    },
    nodes,
  });

  return (
    <div
      className={styles.composeBarContainer}
      data-qa-anchor={accessibilityId}
      style={themeStyles}
    >
      <div className={styles.composeBar}>
        <div ref={optionsRef} className={styles.optionContainer}></div>
        <div className={styles.editorContainer}>
          <LexicalComposer initialConfig={editorConfig}>
            <RichTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={
                <span className={styles.editorPlaceholder}>{config.placeholder_text}</span> ?? null
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <LinkPlugin />
            <AutoLinkPlugin />
            <EditorRefPlugin editorRef={editorRef} />
            <EnterKeyInterceptorPlugin
              onEnter={sendMessage}
              commandPriority={COMMAND_PRIORITY_LOW}
            />
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
          </LexicalComposer>
        </div>
        <div className={styles.sendButtonContainer}>
          <ArrowTop className={styles.sendButton} onClick={() => sendMessage()} />
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
};

export default MessageComposer;
