import React, { useEffect, useMemo, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { COMMAND_PRIORITY_HIGH, Klass, LexicalNode } from 'lexical';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import {
  $createMentionNode,
  MentionNode,
} from '~/v4/social/internal-components/Lexical/nodes/MentionNode';
import { HashtagNode } from '~/v4/social/internal-components/Lexical/nodes/HashtagNode';
import { MentionPlugin } from '~/v4/social/internal-components/Lexical/plugins/MentionPlugin';
import { HashtagPlugin } from '~/v4/social/internal-components/Lexical/plugins/HashtagPlugin';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import { LinkPlugin } from '~/v4/social/internal-components/Lexical/plugins/LinkPlugin';
import { AutoLinkPlugin } from '~/v4/social/internal-components/Lexical/plugins/AutoLinkPlugin';
import { FloatingLinkEditorPlugin } from '~/v4/social/internal-components/Lexical/plugins/FloatingLinkEditorPlugin';
import {
  editorToText,
  getEditorConfig,
  MentionData,
  textToEditorState,
} from '~/v4/social/internal-components/Lexical/utils';
import ReactDOM from 'react-dom';
import { useMemberQueryByDisplayName } from '~/v4/social/hooks/useMemberQueryByDisplayName';
import { useUserQueryByDisplayName } from '~/v4/core/hooks/collections/useUsersCollection';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { MentionItem } from '~/v4/social/internal-components/Lexical/MentionItem';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import clsx from 'clsx';
import styles from './PostTextField.module.css';
import { LinkPreview } from '~/v4/social/components/PostContent/LinkPreview';
import { CloseButton } from '~/v4/social/elements/CloseButton';
import { DEBOUNCE_PREVIEW_LINK } from '~/v4/social/constants/post';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

interface PostTextFieldProps {
  pageId?: string;
  className?: string;
  componentId?: string;
  communityId?: string | null;
  attachmentAmount?: number;
  placeholderClassName?: string;
  mentionContainer?: HTMLElement | null;
  mentionContainerClassName?: string;
  placeholder?: string;
  isValidInput?: string | boolean;
  isClipPost?: boolean;
  isPollPost?: boolean;
  dataValue: {
    data: { text: string };
    metadata?: {
      mentioned?: Mentioned[];
      hashtags?: Amity.Hashtag[];
    };
    mentionees?: Mentionees;
    links?: Amity.Link[];
  };
  onChange: (data: {
    mentioned: Mentioned[];
    mentionees: Mentionees;
    hashtags: Amity.Hashtag[];
    text: string;
    links?: Amity.Link[];
  }) => void;
  onPreviewLinkChange?: (showPreview: boolean, isLoading?: boolean) => void;
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

const nodes = [AutoLinkNode, LinkNode, MentionNode, HashtagNode] as Array<Klass<LexicalNode>>;

export const PostTextField = ({
  onChange,
  dataValue,
  className,
  communityId,
  pageId = '*',
  mentionContainer,
  componentId = '*',
  placeholderClassName,
  mentionContainerClassName,
  placeholder,
  isClipPost = false,
  isPollPost = false,
  isValidInput: dataInputAttributes,
  attachmentAmount = 0,
  onPreviewLinkChange,
}: PostTextFieldProps) => {
  const elementId = 'post_text_field';
  const [intersectionNode, setIntersectionNode] = useState<HTMLElement | null>(null);
  const [hiddenPreviewUrl, setHiddenPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const { isDesktop } = useResponsive();

  const { accessibilityId, resolveText } = useAmityElement({ pageId, componentId, elementId });

  const firstUrl = React.useMemo(() => {
    const links = dataValue?.links;

    if (links && links.length > 0) {
      const firstLinkWithPreview = links.find((link) => link.renderPreview === true);
      return firstLinkWithPreview?.url ?? null;
    }
    return null;
  }, [dataValue?.links]);

  const firstLinkRenderPreview = React.useMemo(() => {
    const links = dataValue?.links;

    if (links && links.length > 0) {
      const firstLinkWithPreview = links.find((link) => link.renderPreview === true);
      return !!firstLinkWithPreview;
    }
    return true;
  }, [dataValue?.links]);

  // Initialize debouncedFirstUrl with the first link that has renderPreview: true
  const [debouncedFirstUrl, setDebouncedFirstUrl] = useState<string | null>(() => {
    const links = dataValue?.links;
    if (links && links.length > 0) {
      const firstLinkWithPreview = links.find((link) => link.renderPreview === true);
      return firstLinkWithPreview?.url ?? null;
    }
    return null;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFirstUrl(firstUrl);
    }, DEBOUNCE_PREVIEW_LINK);

    return () => clearTimeout(timer);
  }, [firstUrl]);

  // Reset hidden preview when the debounced URL changes to a different URL
  useEffect(() => {
    if (debouncedFirstUrl && hiddenPreviewUrl && debouncedFirstUrl !== hiddenPreviewUrl) {
      setHiddenPreviewUrl(null);
    }
  }, [debouncedFirstUrl, hiddenPreviewUrl]);

  // Notify parent component when preview link state changes
  useEffect(() => {
    const showPreview =
      !!debouncedFirstUrl && debouncedFirstUrl !== hiddenPreviewUrl && firstLinkRenderPreview;
    onPreviewLinkChange?.(showPreview, isPreviewLoading);
  }, [
    debouncedFirstUrl,
    hiddenPreviewUrl,
    isPreviewLoading,
    onPreviewLinkChange,
    firstLinkRenderPreview,
  ]);

  // Determine if we should show link preview - only show if there's a valid URL, no attachments, not hidden, and renderPreview is true
  const shouldShowLinkPreview =
    debouncedFirstUrl &&
    !attachmentAmount &&
    debouncedFirstUrl !== hiddenPreviewUrl &&
    firstLinkRenderPreview &&
    !isClipPost &&
    !isPollPost;

  const handleClosePreview = () => {
    if (debouncedFirstUrl) {
      setHiddenPreviewUrl(debouncedFirstUrl);
      onChange({
        mentioned: dataValue.metadata?.mentioned || [],
        mentionees: dataValue.mentionees || [],
        hashtags: dataValue.metadata?.hashtags || [],
        text: dataValue.data.text,
        links: dataValue.links?.map((link, index) => ({
          ...link,
          renderPreview: index === 0 ? false : link.renderPreview,
        })),
      });
    }
  };

  const editorConfig = getEditorConfig({
    namespace: 'PostTextField',
    theme: {
      link: styles.editorLink,
      hashtag: styles.editorHashtag,
      placeholder: styles.editorPlaceholder,
      paragraph: styles.editorParagraph,
    },
    nodes,
  });

  const { onQueryChange, suggestions, isLoading, loadMore } = useSuggestions(communityId);

  useIntersectionObserver({
    onIntersect: () => {
      loadMore();
    },
    node: intersectionNode,
    options: {
      threshold: 0.7,
    },
  });

  return (
    <LexicalComposer
      initialConfig={{
        ...editorConfig,
        ...(dataValue?.data.text
          ? { editorState: JSON.stringify(textToEditorState(dataValue)) }
          : {}),
      }}
    >
      <div
        data-input-validation={dataInputAttributes}
        className={clsx(styles.editorContainer, className)}
        data-testid={accessibilityId}
      >
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={
            <div
              className={clsx(styles.editorPlaceholder, placeholderClassName)}
              data-isclip={componentId === 'clipPost'}
            >
              {placeholder ?? resolveText('amity_social_post_composer_body_placeholder')}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin
          onChange={(_, editor) => {
            const result = editorToText(editor);
            // Set renderPreview based on whether the first link is hidden
            if (result.links && result.links.length > 0) {
              // Filter out placeholder links (links with index: 0, length: 0) when there are actual hyperlinks
              const hasActualHyperlinks = result.links.some((link) => (link?.length ?? 0) > 0);

              result.links = result.links
                .filter((link) => {
                  // Remove placeholder links if we have actual hyperlinks
                  if (hasActualHyperlinks && link.index === 0 && link.length === 0) {
                    return false;
                  }
                  return true;
                })
                .map((link) => {
                  // First check if user manually hid this link
                  if (link.url === hiddenPreviewUrl) {
                    return { ...link, renderPreview: false };
                  }

                  // Trust the value from editorToText, which already correctly determines renderPreview
                  // based on whether the link text matches the URL
                  return { ...link };
                });
            } else if (debouncedFirstUrl && debouncedFirstUrl !== hiddenPreviewUrl) {
              // Keep link data when link was removed but still in debounce period
              // Check if the original link had renderPreview set to false
              const originalLink = dataValue?.links?.find((l) => l.url === debouncedFirstUrl);
              const shouldRenderPreview = originalLink?.renderPreview !== false;

              result.links = [
                {
                  index: 0,
                  length: 0,
                  url: debouncedFirstUrl,
                  renderPreview: shouldRenderPreview,
                },
              ];
            }
            onChange(result);
          }}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <FloatingLinkEditorPlugin enabled={isDesktop} />
        <HashtagPlugin />
        <MentionPlugin<MentionData, MentionNode<MentionData>>
          suggestions={suggestions}
          onQueryChange={onQueryChange}
          commandPriority={COMMAND_PRIORITY_HIGH}
          getSuggestionId={(suggestion) => suggestion.userId}
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
        />
      </div>
      {shouldShowLinkPreview && (
        <div className={styles.linkPreviewContainer}>
          <LinkPreview
            pageId={pageId}
            componentId={componentId}
            url={debouncedFirstUrl}
            onLoadingChange={setIsPreviewLoading}
          />
          {!isPreviewLoading && (
            <CloseButton
              pageId={pageId}
              componentId={componentId}
              className={styles.linkPreviewContainer__closeButton}
              defaultClassName={styles.linkPreviewContainer__closeButton__icon}
              onPress={handleClosePreview}
            />
          )}
        </div>
      )}
    </LexicalComposer>
  );
};
