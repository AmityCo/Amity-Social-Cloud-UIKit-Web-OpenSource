import React, {
  useEffect,
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useRef,
} from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { COMMAND_PRIORITY_HIGH, Klass, LexicalNode, LexicalEditor } from 'lexical';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import {
  $createMentionNode,
  MentionNode,
} from '~/v4/social/internal-components/Lexical/nodes/MentionNode';
import { HashtagNode } from '~/v4/social/internal-components/Lexical/nodes/HashtagNode';
import {
  MentionPlugin,
  MentionTypeaheadOption,
} from '~/v4/social/internal-components/Lexical/plugins/MentionPlugin';
import { HashtagPlugin } from '~/v4/social/internal-components/Lexical/plugins/HashtagPlugin';
import { CharacterLimitPlugin } from '~/v4/social/internal-components/Lexical/plugins/CharacterLimitPlugin';
import { LinkPlugin } from '~/v4/social/internal-components/Lexical/plugins/LinkPlugin';
import { MentionDeletionPlugin } from '~/v4/social/internal-components/Lexical/plugins/MentionDeletionPlugin';
import { AutoLinkPlugin } from '~/v4/social/internal-components/Lexical/plugins/AutoLinkPlugin';
import {
  editorToText,
  getEditorConfig,
  MentionData,
  textToEditorState,
} from '~/v4/social/internal-components/Lexical/utils';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import clsx from 'clsx';
import styles from './TextEditor.module.css';
import { isNonNullable, Mentioned, Mentionees } from '~/v4/helpers/utils';
import { DisplayMode } from '~/v4/social/types';
import { useSuggestions } from './hooks/useSuggestions';
import { useProductSuggestions } from './hooks/useProductSuggestions';
import { useMentionMenuState } from './hooks/useMentionMenuState';
import { MentionMenu } from './MentionMenu';
import {
  DEFAULT_MAX_MENTIONS,
  DEFAULT_MAX_HASHTAGS,
  DEFAULT_MAX_PRODUCTS,
  CONTENT_TYPE_DEFAULTS,
} from '~/v4/constants/text-editor';
import { COMPONENT_ID } from '~/v4/constants/customization';
import { PasteLimitPlugin } from '~/v4/social/internal-components/Lexical/plugins/PasteLimitPlugin';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { FloatingLinkEditorPlugin } from '~/v4/social/internal-components/Lexical/plugins/FloatingLinkEditorPlugin';
import { LinkValidationPlugin } from '~/v4/social/internal-components/Lexical/plugins/LinkValidationPlugin';
import { useString } from '~/v4/core/localization';

// Content type enum
export type EditorContentType = 'post' | 'comment' | 'message';

// Suggestion display mode
export type SuggestionDisplayMode = 'inline' | 'bottom';

export type ProductMentionData = { productId: string; displayName: string; product: Amity.Product };

// URL highlight
export interface UrlHighlight {
  url: string;
  start: number;
  end: number;
  renderPreview: boolean; // Can be a boolean or the UrlHighlight itself for more complex handling
}

export interface TextEditorProps {
  // Required
  editorContentType: EditorContentType;

  // Conditional based on content type
  communityId?: string | null;
  channelId?: string;

  // Optional configuration
  maxMentions?: number;
  enableHashtag?: boolean;
  maxHashtags?: number;
  enableUrlDetection?: boolean;
  urlHighlights?: UrlHighlight[];
  enableProductMention?: boolean;
  maxUniqueProductMentions?: number;
  initialProductMentions?: Amity.TextProductTag[];
  taggedProductIds?: string[];
  initialHashtags?: Amity.Hashtag[];
  suggestionDisplayMode?: SuggestionDisplayMode;
  suggestionMaxRows?: number;
  suggestionMaxHeight?: number;
  enableMention?: boolean;
  maxCharacters?: number;
  maxLines?: number;
  minLines?: number;
  placeholder?: string;
  isEnabled?: boolean;
  autoFocus?: boolean;
  initialText?: string;
  initialMentions?: Mentioned[];
  enableFloatingLink?: boolean;
  initialLinks?: Amity.Link[];

  // Callbacks
  onTextChanged?: (text: string) => void;
  onMentionSelected?: (user: Amity.User) => void;
  onProductSelected?: (product: Amity.Product) => void;
  onMentionsChanged?: (mentions: Mentioned[]) => void;
  onProductMentionsChanged?: (productMentions: Amity.TextProductTag[]) => void;
  onHashtagsChanged?: (hashtags: Amity.Hashtag[]) => void;
  onHashtagAdded?: (hashtag: string) => void;
  onUrlsDetected?: (urls: UrlHighlight[]) => void;

  // Styling
  pageId?: string;
  className?: string;
  placeholderClassName?: string;
  displayMode?: DisplayMode;
}

export interface TextEditorHandle {
  clear: () => void;
  focus: () => void;
  blur: () => void;
  getMentioned: () => Mentioned[];
  getMentionUserIds: () => string[];
  getText: () => string;
  getProductMentions: () => Amity.TextProductTag[];
  getUniqueProductIds: () => string[];
  getHashtags: () => Amity.Hashtag[];
  getHashtagTexts: () => string[];
  getUrls: () => UrlHighlight[];
  getUrlStrings: () => string[];
}

const nodes = [AutoLinkNode, LinkNode, MentionNode, HashtagNode] as Array<Klass<LexicalNode>>;

export const TextEditor = forwardRef<TextEditorHandle, TextEditorProps>(
  (
    {
      editorContentType,
      communityId,
      channelId,
      maxMentions = DEFAULT_MAX_MENTIONS,
      enableHashtag,
      maxHashtags = DEFAULT_MAX_HASHTAGS,
      enableUrlDetection,
      enableProductMention = false,
      maxUniqueProductMentions = DEFAULT_MAX_PRODUCTS,
      taggedProductIds = [],
      suggestionDisplayMode = 'inline',
      enableMention = true,
      maxCharacters,
      maxLines,
      minLines = 1,
      placeholder,
      isEnabled = true,
      autoFocus = false,
      initialText,
      initialMentions,
      initialHashtags,
      initialProductMentions,
      onTextChanged,
      onMentionSelected,
      onProductSelected,
      onMentionsChanged,
      onHashtagsChanged,
      onProductMentionsChanged,
      onHashtagAdded,
      onUrlsDetected,
      pageId = '*',
      className,
      placeholderClassName,
      displayMode,
      enableFloatingLink,
      initialLinks,
    },
    ref,
  ) => {
    const componentId = COMPONENT_ID.TEXT_EDITOR_COMPONENT;
    const [editorInstance, setEditorInstance] = useState<LexicalEditor | null>(null);
    const [intersectionNode, setIntersectionNode] = useState<HTMLElement | null>(null);
    const [currentData, setCurrentData] = useState<{
      text: string;
      mentioned: Mentioned[];
      mentionees: Mentionees;
      hashtags: Amity.Hashtag[];
      links?: Amity.Link[];
    }>({
      text: initialText || '',
      mentioned: initialMentions || [],
      mentionees: [],
      hashtags: initialHashtags || [],
      links: initialLinks || [],
    });

    const prevHashtagCountsRef = useRef<Map<string, number>>(new Map());
    const prevProductMentionsRef = useRef<string | null>(null);

    const { client } = useSDK();
    const [isProductCatalogueEnabled, setIsProductCatalogueEnabled] = useState<boolean | null>(
      null,
    );

    // Check product catalogue setting on mount
    useEffect(() => {
      if (!enableProductMention) return;

      const checkProductCatalogueSetting = async () => {
        try {
          const setting = await client?.getProductCatalogueSetting();
          setIsProductCatalogueEnabled(setting?.product?.enabled ?? false);
        } catch {
          setIsProductCatalogueEnabled(false);
        }
      };
      checkProductCatalogueSetting();
    }, [client, enableProductMention]);

    const { themeStyles, accessibilityId } = useAmityComponent({
      pageId,
      componentId,
    });

    // Get defaults for content type
    const defaults = CONTENT_TYPE_DEFAULTS[editorContentType];
    const finalEnableHashtag = enableHashtag ?? defaults.enableHashtag;
    const finalEnableUrlDetection = enableUrlDetection ?? defaults.enableUrlDetection;
    const defaultPlaceholder = useString(defaults.placeholderKey);
    const finalPlaceholder = placeholder ?? defaultPlaceholder;
    const finalMaxCharacters = maxCharacters ?? defaults.maxCharacters;
    const finalMaxLines = maxLines ?? defaults.maxLines;
    const finalMinLines = minLines;

    const editorConfig = getEditorConfig({
      namespace: 'TextEditor',
      theme: {
        link: styles.textEditor__link,
        hashtag: styles.textEditor__hashtag,
        placeholder: clsx(styles.textEditor__placeholder, placeholderClassName),
        paragraph: styles.textEditor__paragraph,
      },
      nodes,
    });

    // Use custom hooks for mentions
    const {
      suggestions,
      onQueryChange: originalOnQueryChange,
      hasMore,
      loadMore,
      isLoading,
    } = useSuggestions(editorContentType, communityId, channelId);

    // Use custom hooks for product mentions
    const {
      suggestions: productSuggestions,
      onQueryChange: originalProductQueryChange,
      loadMore: loadMoreProducts,
      hasMore: hasMoreProducts,
      queryString: productQueryString,
      isLoading: isLoadingProducts,
    } = useProductSuggestions(enableProductMention);

    const { createQueryChangeHandler, filterSuggestions, closeMenu, isMenuClosed } =
      useMentionMenuState();

    const onQueryChange = useCallback(
      createQueryChangeHandler((query) => {
        originalOnQueryChange(query);
        if (enableProductMention) {
          originalProductQueryChange(query);
        }
      }),
      [
        createQueryChangeHandler,
        originalOnQueryChange,
        originalProductQueryChange,
        enableProductMention,
      ],
    );

    const filteredSuggestions = useMemo(
      () => filterSuggestions(suggestions),
      [filterSuggestions, suggestions],
    );

    const filteredProductSuggestions = useMemo(
      () => filterSuggestions(productSuggestions),
      [filterSuggestions, productSuggestions],
    );

    // Convert product suggestions to MentionTypeaheadOption format
    const productOptions = useMemo(
      () =>
        filteredProductSuggestions.map(
          (product) =>
            new MentionTypeaheadOption({
              data: product,
              dataId: product.productId,
            }),
        ),
      [filteredProductSuggestions],
    );

    // Build initial editor state
    const initialEditorState = useMemo(() => {
      if (initialText) {
        return JSON.stringify(
          textToEditorState({
            data: { text: initialText },
            metadata: {
              mentioned: initialMentions,
              hashtags: initialHashtags,
            },
            links: initialLinks || [],
            mentionees: [],
            productTags: initialProductMentions,
          }),
        );
      }
      return undefined;
    }, []);

    // Update editor editable state when isEnabled changes
    useEffect(() => {
      if (editorInstance) {
        editorInstance.setEditable(isEnabled);
      }
    }, [isEnabled, editorInstance]);

    // Update editor state when initialProductMentions changes
    // Keep current text/mentions/hashtags but replace product mention nodes
    useEffect(() => {
      if (!editorInstance) return;

      // Compare by content, not reference
      const serialized = JSON.stringify(initialProductMentions ?? []);

      // Skip initial run - just store the value without rebuilding
      if (prevProductMentionsRef.current === null) {
        prevProductMentionsRef.current = serialized;
        return;
      }

      // Skip if content hasn't changed
      if (serialized === prevProductMentionsRef.current) return;

      // Check if editor already has these product tags (avoid rebuilding for internal changes)
      const currentState = editorToText(editorInstance);
      const currentProductTagsSerialized = JSON.stringify(
        currentState.textProductTags.map(({ productId, index, length }) => ({
          productId,
          index,
          length,
        })),
      );
      const incomingProductTagsSerialized = JSON.stringify(
        (initialProductMentions ?? []).map(({ productId, index, length }) => ({
          productId,
          index,
          length,
        })),
      );

      // If editor already has the same product tags, just update ref and skip rebuild
      if (currentProductTagsSerialized === incomingProductTagsSerialized) {
        prevProductMentionsRef.current = serialized;
        return;
      }

      prevProductMentionsRef.current = serialized;

      const newEditorState = JSON.stringify(
        textToEditorState({
          data: { text: currentState.text },
          metadata: {
            mentioned: currentState.mentioned,
            hashtags: currentState.hashtags,
          },
          mentionees: currentState.mentionees,
          links: currentState.links,
          productTags: initialProductMentions ?? [],
        }),
      );

      const parsedState = editorInstance.parseEditorState(newEditorState);
      editorInstance.setEditorState(parsedState);
    }, [initialProductMentions, editorInstance]);

    // Expose imperative methods
    useImperativeHandle(ref, () => ({
      clear: () => {
        if (editorInstance) {
          editorInstance.update(() => {
            const root = editorInstance.getRootElement();
            if (root) {
              root.textContent = '';
            }
          });
        }
        setCurrentData({
          text: '',
          mentioned: [],
          mentionees: [],
          hashtags: [],
          links: [],
        });
      },
      focus: () => {
        editorInstance?.focus();
      },
      blur: () => {
        editorInstance?.blur();
      },
      getMentioned: () => {
        return currentData.mentioned.map((m) => ({
          type: m.userId ? 'user' : 'channel',
          userId: m.userId,
          index: m.index,
          length: m.length,
        }));
      },
      getMentionUserIds: () => {
        return Array.from(new Set(currentData.mentioned.map((m) => m.userId)))?.filter(
          isNonNullable,
        );
      },
      getText: () => {
        return currentData.text;
      },
      getProductMentions: () => {
        // TODO: Implement product mentions
        return [];
      },
      getUniqueProductIds: () => {
        // TODO: Implement product mentions
        return [];
      },
      getHashtags: () => {
        return currentData.hashtags || [];
      },
      getHashtagTexts: () => {
        return (currentData.hashtags || []).map((h) => h.text);
      },
      getUrls: () => {
        return currentData.links
          ? currentData.links.map((link) => ({
              url: link.url,
              start: link.index ?? 0,
              end: (link.index ?? 0) + (link.length ?? 0),
              renderPreview: link.renderPreview ?? false,
            })) || []
          : [];
      },
      getUrlStrings: () => {
        return (currentData.links || []).map((link) => link.url);
      },
    }));

    return (
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(initialEditorState ? { editorState: initialEditorState } : {}),
        }}
      >
        <div
          className={clsx(styles.textEditor, className)}
          data-testid={accessibilityId}
          style={
            {
              ...themeStyles,
              '--asc-max-lines': finalMaxLines,
              '--asc-min-lines': finalMinLines,
            } as React.CSSProperties
          }
          data-content-type={editorContentType}
          data-display-mode={displayMode}
        >
          <RichTextPlugin
            contentEditable={<ContentEditable className={styles.textEditor__content} />}
            placeholder={<div className={styles.textEditor__placeholder}>{finalPlaceholder}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={(_, editor) => {
              setEditorInstance(editor);
              const result = editorToText(editor);
              setCurrentData(result);

              // Trigger callbacks
              onTextChanged?.(result.text);
              onMentionsChanged?.(
                result.mentioned.map((m) => ({
                  type: m.userId ? 'user' : 'channel',
                  userId: m.userId,
                  index: m.index,
                  length: m.length,
                })),
              );

              onProductMentionsChanged?.([...result.textProductTags]);

              if (finalEnableHashtag) {
                onHashtagsChanged?.(result.hashtags);

                // Count current hashtags
                const currentHashtagCounts = new Map<string, number>();
                result.hashtags.forEach((h) => {
                  const count = currentHashtagCounts.get(h.text) || 0;
                  currentHashtagCounts.set(h.text, count + 1);
                });

                // Compare with previous counts and trigger for new instances
                currentHashtagCounts.forEach((currentCount, hashtagText) => {
                  const previousCount = prevHashtagCountsRef.current.get(hashtagText) || 0;
                  const newInstances = currentCount - previousCount;

                  // Trigger callback for each new instance
                  for (let i = 0; i < newInstances; i++) {
                    onHashtagAdded?.(hashtagText);
                  }
                });

                // Update the ref with current counts
                prevHashtagCountsRef.current = new Map(currentHashtagCounts);
              }
              if (finalEnableUrlDetection && result.links) {
                const urls: UrlHighlight[] = result.links.map((link) => ({
                  url: link.url,
                  start: link.index ?? 0,
                  end: (link.index ?? 0) + (link.length ?? 0),
                  renderPreview: link.renderPreview,
                }));
                onUrlsDetected?.(urls);
              }
            }}
          />
          <HistoryPlugin />
          {finalMaxCharacters && <CharacterLimitPlugin maxCharacters={finalMaxCharacters} />}
          {finalMaxCharacters && <PasteLimitPlugin maxCharacters={finalMaxCharacters} />}
          {autoFocus && <AutoFocusPlugin />}
          {finalEnableUrlDetection && (
            <>
              <FloatingLinkEditorPlugin enabled={enableFloatingLink} />
              <LinkPlugin />
              <AutoLinkPlugin />
              <LinkValidationPlugin />
            </>
          )}
          {finalEnableHashtag && <HashtagPlugin maxHashtags={maxHashtags} />}
          {enableMention && <MentionDeletionPlugin />}
          {enableMention && (
            <MentionPlugin<
              MentionData | ProductMentionData,
              MentionNode<MentionData | ProductMentionData>
            >
              suggestions={filteredSuggestions}
              onQueryChange={onQueryChange}
              commandPriority={COMMAND_PRIORITY_HIGH}
              getSuggestionId={(suggestion) => {
                return 'userId' in suggestion ? suggestion.userId : suggestion.productId;
              }}
              maxMentions={maxMentions}
              maxUniqueProductMentions={maxUniqueProductMentions}
              $createNode={(data) =>
                $createMentionNode({
                  text:
                    'userId' in data
                      ? `@${data.displayName}`
                      : 'productId' in data
                        ? data.displayName
                        : '',
                  data,
                })
              }
              anchorClassName={styles.textEditor__anchor}
              menuRenderFn={(
                menuRenderRef,
                { options, selectedIndex, setHighlightedIndex, selectOptionAndCleanUp },
              ) => {
                // Return null if menu was manually closed
                if (isMenuClosed) return null;

                return (
                  <MentionMenu<MentionData | ProductMentionData>
                    menuRenderRef={menuRenderRef}
                    options={options}
                    productOptions={enableProductMention ? productOptions : undefined}
                    isProductCatalogueEnabled={isProductCatalogueEnabled}
                    queryString={productQueryString}
                    isLoadingProducts={isLoadingProducts}
                    taggedProductIds={taggedProductIds}
                    selectedIndex={selectedIndex}
                    setHighlightedIndex={setHighlightedIndex}
                    selectOptionAndCleanUp={selectOptionAndCleanUp}
                    onMentionSelected={(userData) => {
                      onMentionSelected?.(userData);
                    }}
                    onProductSelected={(productData) => {
                      onProductSelected?.(productData.product);
                    }}
                    onCloseMenu={closeMenu}
                    // onSetIntersectionNode removed, handled internally
                    loadMoreUsers={loadMore}
                    hasMoreUsers={hasMore}
                    isLoadingUsers={isLoading}
                    loadMoreProducts={loadMoreProducts}
                    hasMoreProducts={hasMoreProducts}
                    pageId={pageId}
                    componentId={componentId}
                  />
                );
              }}
            />
          )}
        </div>
      </LexicalComposer>
    );
  },
);

TextEditor.displayName = 'TextEditor';
