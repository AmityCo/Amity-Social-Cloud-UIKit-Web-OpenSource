import React, { forwardRef, MutableRefObject, useImperativeHandle, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';
import { $getRoot, LexicalEditor, Klass, LexicalNode, COMMAND_PRIORITY_HIGH } from 'lexical';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import styles from './CommentInput.module.css';
import { CreateCommentParams } from '~/v4/social/components/CommentComposer/CommentComposer';
import {
  editorToText,
  getEditorConfig,
  MentionData,
  textToEditorState,
} from '~/v4/social/internal-components/Lexical/utils';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import {
  $createMentionNode,
  MentionNode,
} from '~/v4/social/internal-components/Lexical/nodes/MentionNode';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import { AutoLinkPlugin } from '~/v4/social/internal-components/Lexical/plugins/AutoLinkPlugin';
import { LinkPlugin } from '~/v4/social/internal-components/Lexical/plugins/LinkPlugin';
import { FloatingLinkEditorPlugin } from '~/v4/social/internal-components/Lexical/plugins/FloatingLinkEditorPlugin';
import { MentionPlugin } from '~/v4/social/internal-components/Lexical/plugins/MentionPlugin';
import { useUserQueryByDisplayName } from '~/v4/core/hooks/collections/useUsersCollection';
import { useMemberQueryByDisplayName } from '~/v4/social/hooks/useMemberQueryByDisplayName';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { MentionItem } from '~/v4/social/internal-components/Lexical/MentionItem';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

interface CommentInputProps {
  pageId?: string;
  componentId?: string;
  communityId?: string;
  value?: CreateCommentParams;
  maxLines?: number;
  placehoder?: string;
  targetType?: string;
  targetId?: string;
  ref: MutableRefObject<LexicalEditor | null | undefined>;
  mentionContainer?: HTMLElement | null;
  mentionContainerClassName?: string;
  shouldAutoFocus?: boolean;
  onFocus?: () => void;
  onChange: (data: {
    mentioned: Mentioned[];
    mentionees: Mentionees;
    text: string;
    links?: Amity.Link[];
  }) => void;
}

export interface CommentInputRef {
  clearEditorState: () => void;
  focus: () => void;
}

const useSuggestions = (communityId?: string | null) => {
  const [queryString, setQueryString] = useState<string | null>(null);

  const { community, isLoading: isCommunityLoading } = useCommunity({ communityId });

  const isSearchCommunityMembers = useMemo(
    () => !!communityId && !isCommunityLoading && !community?.isPublic,
    [communityId, isCommunityLoading, community],
  );

  const {
    members,
    hasMore: hasMoreMember,
    isLoading: isLoadingMember,
    loadMore: loadMoreMember,
  } = useMemberQueryByDisplayName({
    communityId: communityId || '',
    displayName: queryString || '',
    limit: 10,
    enabled: isSearchCommunityMembers,
  });
  const {
    users,
    hasMore: hasMoreUser,
    loadMore: loadMoreUser,
    isLoading: isLoadingUser,
  } = useUserQueryByDisplayName({
    displayName: queryString || '',
    limit: 10,
    enabled: !isSearchCommunityMembers,
  });

  const onQueryChange = (newQuery: string | null) => {
    setQueryString(newQuery);
  };

  const suggestions = useMemo(() => {
    if (!!communityId && isCommunityLoading) return [];

    if (isSearchCommunityMembers) {
      return members.map(({ user, userId }) => ({
        userId: user?.userId || userId,
        displayName: user?.displayName,
      }));
    }

    return users.map(({ displayName, userId }) => ({
      userId: userId,
      displayName: displayName,
    }));
  }, [users, members, isSearchCommunityMembers, isCommunityLoading]);

  const hasMore = useMemo(() => {
    if (isSearchCommunityMembers) {
      return hasMoreMember;
    } else {
      return hasMoreUser;
    }
  }, [isSearchCommunityMembers, hasMoreMember, hasMoreUser]);

  const loadMore = () => {
    if (isLoading || !hasMore) return;
    if (isSearchCommunityMembers) {
      loadMoreMember();
    } else {
      loadMoreUser();
    }
  };

  const isLoading = useMemo(() => {
    if (isSearchCommunityMembers) {
      return isLoadingMember;
    } else {
      return isLoadingUser;
    }
  }, [isLoadingMember, isLoadingUser, isSearchCommunityMembers]);

  return { suggestions, queryString, onQueryChange, loadMore, hasMore, isLoading };
};

const nodes = [AutoLinkNode, LinkNode, MentionNode] as Array<Klass<LexicalNode>>;

export const CommentInput = forwardRef<CommentInputRef, CommentInputProps>(
  (
    {
      pageId = '*',
      componentId = '*',
      communityId,
      value,
      onChange,
      maxLines = 10,
      placehoder,
      mentionContainer,
      mentionContainerClassName,
      shouldAutoFocus = false,
      onFocus,
    },
    ref,
  ) => {
    const [intersectionNode, setIntersectionNode] = useState<HTMLElement | null>(null);
    const elementId = 'comment_input';
    const { isDesktop } = useResponsive();
    const { themeStyles, uiReference, config, accessibilityId } = useAmityElement({
      pageId,
      componentId,
      elementId,
    });

    const { onQueryChange, suggestions, isLoading, loadMore, hasMore } =
      useSuggestions(communityId);

    useIntersectionObserver({
      onIntersect: () => {
        if (isLoading === false) {
          loadMore();
        }
      },
      node: intersectionNode,
      options: {
        threshold: 0.7,
      },
    });

    const editorRef = React.useRef<LexicalEditor | null | undefined>(null);

    const clearEditorState = () => {
      editorRef.current?.update(() => {
        const root = $getRoot();
        root.clear();
      });
      setTimeout(() => {
        editorRef.current?.blur();
      }, 500);
    };

    useImperativeHandle(ref, () => ({
      clearEditorState,
      focus: () => {
        const rootElement = editorRef.current?.getRootElement();
        if (rootElement) {
          rootElement.focus({ preventScroll: true });
        }
      },
    }));

    const editorConfig = getEditorConfig({
      namespace: uiReference,
      theme: {
        // root: styles.editorRoot,
        placeholder: styles.editorPlaceholder,
        paragraph: styles.editorParagraph,
        link: styles.editorLink,
      },
      nodes,
    });

    return (
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(value?.data?.text ? { editorState: JSON.stringify(textToEditorState(value)) } : {}),
        }}
      >
        <div
          className={styles.editorContainer}
          style={
            {
              '--asc-max-lines': maxLines,
            } as React.CSSProperties
          }
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                data-testid={accessibilityId}
                className={styles.editorEditableContent}
                onFocus={() => {
                  if (onFocus) {
                    onFocus();
                  }
                }}
              />
            }
            placeholder={
              placehoder ? <div className={styles.editorPlaceholder}>{placehoder}</div> : null
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={(_, editor) => {
              onChange(editorToText(editor));
            }}
          />
          <HistoryPlugin />
          {shouldAutoFocus && <AutoFocusPlugin />}
          <LinkPlugin />
          <AutoLinkPlugin />
          <FloatingLinkEditorPlugin enabled={isDesktop} />
          <EditorRefPlugin editorRef={editorRef} />
          <MentionPlugin<MentionData, MentionNode<MentionData>>
            suggestions={suggestions}
            getSuggestionId={(suggestion) => suggestion.userId}
            onQueryChange={onQueryChange}
            $createNode={(data) =>
              $createMentionNode({
                text: `@${data?.displayName || ''}`,
                data,
              })
            }
            menuRenderFn={(
              menuRenderRef,
              { options, selectedIndex, setHighlightedIndex, selectOptionAndCleanUp },
            ) => {
              if (options.length === 0) return null;

              const optionList = options.map((option, i: number) => {
                return (
                  <MentionItem
                    pageId={pageId}
                    componentId={componentId}
                    isSelected={selectedIndex === i}
                    onClick={() => {
                      setHighlightedIndex(i);
                      selectOptionAndCleanUp(option);
                    }}
                    onMouseEnter={() => {
                      setHighlightedIndex(i);
                    }}
                    key={option.key}
                    option={{
                      ...option,
                      setRefElement: (element) => {
                        if (i === options.length - 1) {
                          setIntersectionNode(element);
                        }
                        option.setRefElement(element);
                      },
                    }}
                  />
                );
              });

              if (mentionContainer) return ReactDOM.createPortal(optionList, mentionContainer);

              return menuRenderRef?.current
                ? ReactDOM.createPortal(
                    <div className={mentionContainerClassName}>{optionList}</div>,
                    menuRenderRef.current,
                  )
                : null;
            }}
            commandPriority={COMMAND_PRIORITY_HIGH}
          />
        </div>
      </LexicalComposer>
    );
  },
);
