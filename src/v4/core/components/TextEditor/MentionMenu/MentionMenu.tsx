import React, { useState, useEffect, useRef } from 'react';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import ReactDOM from 'react-dom';
import { UserMentionItem } from './UserMentionItem';
import { Button } from '~/v4/core/components/AriaButton';
import { TagOutlined } from '~/v4/icons/TagOutlined';
import UserRegular from '~/v4/icons/UserRegular';
import Close from '~/v4/icons/Close';
import { MentionTypeaheadOption } from '~/v4/social/internal-components/Lexical/plugins/MentionPlugin';
import styles from './MentionMenu.module.css';
import { ProductTagEmpty, ProductTagNoResult } from '~/v4/social/features/product-tagged';
import { ProductMentionItem } from './ProductMentionItem';
import { NoResultFound } from '~/v4/social/internal-components/NoResultFound';
import {
  UserListItemSkeleton,
  ProductMentionItemSkeleton,
} from '~/v4/social/internal-components/Skeleton';
import { SEARCH_PRODUCT_MINIMUM_CHARACTER } from '~/social/constants';
import { MentionMenuTabs } from './MentionMenuTabs';

export interface MentionMenuProps<T> {
  menuRenderRef: React.RefObject<HTMLElement>;
  options: MentionTypeaheadOption<T>[]; // User options
  productOptions?: MentionTypeaheadOption<any>[]; // Product options
  isProductCatalogueEnabled?: boolean | null;
  queryString?: string | null;
  isLoadingProducts?: boolean;
  taggedProductIds?: string[];
  selectedIndex: number | null;
  setHighlightedIndex: (index: number) => void;
  selectOptionAndCleanUp: (option: MentionTypeaheadOption<T>) => void;
  onMentionSelected?: (user: Amity.User) => void;
  onProductSelected?: (product: any) => void;
  onCloseMenu: () => void;
  // onSetIntersectionNode is no longer needed, handled internally
  pageId: string;
  componentId: string;
  // Add loadMore and hasMore/isLoading for both users and products
  loadMoreUsers?: () => void;
  hasMoreUsers?: boolean;
  isLoadingUsers?: boolean;
  loadMoreProducts?: () => void;
  hasMoreProducts?: boolean;
}

// Separate function to render mention list
function renderUserMentionList<T>({
  options,
  selectedIndex,
  setHighlightedIndex,
  selectOptionAndCleanUp,
  onMentionSelected,
  onSetIntersectionNode,
  pageId,
  componentId,
}: {
  options: MentionTypeaheadOption<T>[];
  selectedIndex: number | null;
  setHighlightedIndex: (index: number) => void;
  selectOptionAndCleanUp: (option: MentionTypeaheadOption<T>) => void;
  onMentionSelected?: (user: Amity.User) => void;
  onSetIntersectionNode: (element: HTMLElement | null) => void;
  pageId: string;
  componentId: string;
}) {
  return options.map((option, i: number) => {
    const wrappedOption = {
      ...option,
      setRefElement: (element: HTMLElement | null) => {
        if (i === options.length - 1) {
          onSetIntersectionNode(element);
        }
        option.setRefElement(element);
      },
    };

    return (
      <UserMentionItem
        pageId={pageId}
        componentId={componentId}
        isSelected={selectedIndex === i}
        onClick={(user) => {
          setHighlightedIndex(i);
          selectOptionAndCleanUp(option);
          if (onMentionSelected && option.data) {
            onMentionSelected(user);
          }
        }}
        onMouseEnter={() => {
          setHighlightedIndex(i);
        }}
        key={option.key}
        option={wrappedOption as any}
      />
    );
  });
}

function renderProductMentionList<T>({
  options,
  selectedIndex,
  setHighlightedIndex,
  selectOptionAndCleanUp,
  onMentionSelected,
  onSetIntersectionNode,
  pageId,
  componentId,
  taggedProductIds = [],
}: {
  options: MentionTypeaheadOption<T>[];
  selectedIndex: number | null;
  setHighlightedIndex: (index: number) => void;
  selectOptionAndCleanUp: (option: MentionTypeaheadOption<T>) => void;
  onMentionSelected?: (product: Amity.Product) => void;
  onSetIntersectionNode: (element: HTMLElement | null) => void;
  pageId: string;
  componentId: string;
  taggedProductIds?: string[];
}) {
  return options.map((option, i: number) => {
    const wrappedOption = {
      ...option,
      setRefElement: (element: HTMLElement | null) => {
        if (i === options.length - 1) {
          onSetIntersectionNode(element);
        }
        option.setRefElement(element);
      },
    };

    const productId = (option.data as any)?.productId;
    const isAlreadyTagged = productId ? taggedProductIds.includes(productId) : false;

    return (
      <ProductMentionItem
        pageId={pageId}
        componentId={componentId}
        isSelected={selectedIndex === i}
        isAlreadyTagged={isAlreadyTagged}
        onClick={(product) => {
          if (isAlreadyTagged) return;
          setHighlightedIndex(i);
          selectOptionAndCleanUp(option);
          if (onMentionSelected && option.data) {
            onMentionSelected(product);
          }
        }}
        onMouseEnter={() => {
          setHighlightedIndex(i);
        }}
        key={option.key}
        option={wrappedOption as any}
      />
    );
  });
}

export function MentionMenu<T>({
  menuRenderRef,
  options,
  productOptions = [],
  isProductCatalogueEnabled,
  queryString = '',
  isLoadingProducts = false,
  taggedProductIds = [],
  selectedIndex,
  setHighlightedIndex,
  selectOptionAndCleanUp,
  onMentionSelected,
  onProductSelected,
  onCloseMenu,
  pageId,
  componentId,
  loadMoreUsers,
  hasMoreUsers,
  isLoadingUsers,
  loadMoreProducts,
  hasMoreProducts,
}: MentionMenuProps<T>) {
  const [activeTab, setActiveTab] = useState<'users' | 'products'>('users');
  const containerRef = useRef<HTMLDivElement>(null);
  const userIntersectionNode = useRef<HTMLElement | null>(null);
  const productIntersectionNode = useRef<HTMLElement | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onCloseMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCloseMenu]);

  const userMentionList = renderUserMentionList({
    options,
    selectedIndex: activeTab === 'users' || !isProductCatalogueEnabled ? selectedIndex : null,
    setHighlightedIndex,
    selectOptionAndCleanUp,
    onMentionSelected,
    onSetIntersectionNode: (el) => {
      userIntersectionNode.current = el;
    },
    pageId,
    componentId,
  });

  const productMentionList =
    productOptions.length > 0
      ? renderProductMentionList({
          options: productOptions,
          selectedIndex: activeTab === 'products' ? selectedIndex : null,
          setHighlightedIndex,
          selectOptionAndCleanUp: selectOptionAndCleanUp as any,
          onMentionSelected: onProductSelected as any,
          onSetIntersectionNode: (el) => {
            productIntersectionNode.current = el;
          },
          pageId,
          componentId,
          taggedProductIds,
        })
      : null;
  // Intersection observer for users tab
  useIntersectionObserver({
    node: activeTab === 'users' ? userIntersectionNode.current : null,
    onIntersect: () => {
      if (activeTab === 'users' && !isLoadingUsers && hasMoreUsers && loadMoreUsers) {
        loadMoreUsers();
      }
    },
    options: { threshold: 0.7 },
  });

  // Intersection observer for products tab
  useIntersectionObserver({
    node: activeTab === 'products' ? productIntersectionNode.current : null,
    onIntersect: () => {
      if (activeTab === 'products' && !isLoadingProducts && hasMoreProducts && loadMoreProducts) {
        loadMoreProducts();
      }
    },
    options: { threshold: 0.7 },
  });

  const productMentionSkeletons = Array.from({ length: 2 }).map((_, index) => (
    <div className={styles.mentionList__productMentionList__skeletonItem}>
      <ProductMentionItemSkeleton key={`product-skeleton-${index}`} />
    </div>
  ));

  // If product catalogue is not enabled, show only user mention list without tabs
  if (isProductCatalogueEnabled === false) {
    return menuRenderRef?.current
      ? ReactDOM.createPortal(
          <div data-react-aria-top-layer ref={containerRef} className={styles.mentionContainer}>
            <div className={styles.mentionContainer__inner} data-user-only={true}>
              <div className={styles.mentionList}>
                {options.length > 0 ? (
                  userMentionList
                ) : !isLoadingUsers ? (
                  <div className={styles.mentionList__noResult}>
                    <NoResultFound />
                  </div>
                ) : (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`user-skeleton-${index}`}
                      className={styles.mentionList__userMentionList__skeletonItem}
                    >
                      <UserListItemSkeleton key={index} />
                    </div>
                  ))
                )}
              </div>
            </div>
            <Button
              icon={<Close />}
              className={styles.mentionContainer__closeButton}
              iconClassName={styles.mentionContainer__closeButton__icon}
              onPress={onCloseMenu}
            />
          </div>,
          menuRenderRef.current,
        )
      : null;
  }

  return menuRenderRef?.current
    ? ReactDOM.createPortal(
        <div data-react-aria-top-layer ref={containerRef} className={styles.mentionContainer}>
          <div className={styles.mentionContainer__inner}>
            <MentionMenuTabs
              variant="iconSmall"
              value={activeTab}
              onChange={(key) => setActiveTab(key as 'users' | 'products')}
              className={styles.mentionTabs}
              tabListClassName={styles.mentionTabs__tabList}
              tabPanelClassName={styles.mentionTabs__tabPanel}
              aria-label="Mention menu tabs"
              tabs={[
                {
                  value: 'users',
                  label: UserRegular,
                  accessibilityId: 'mention-menu-users-tab',
                  content: () => (
                    <div className={styles.mentionList}>
                      {options.length > 0 ? (
                        userMentionList
                      ) : !isLoadingUsers ? (
                        <div className={styles.mentionList__noResult}>
                          <NoResultFound />
                        </div>
                      ) : (
                        Array.from({ length: 3 }).map((_, index) => (
                          <div
                            key={`user-skeleton-${index}`}
                            className={styles.mentionList__userMentionList__skeletonItem}
                          >
                            <UserListItemSkeleton key={index} />
                          </div>
                        ))
                      )}
                    </div>
                  ),
                },
                {
                  value: 'products',
                  label: TagOutlined,
                  accessibilityId: 'mention-menu-products-tab',
                  content: () => {
                    const queryLength = queryString?.length || 0;

                    // Show empty state if query is too short
                    if (queryLength < SEARCH_PRODUCT_MINIMUM_CHARACTER) {
                      return (
                        <div className={styles.mentionList}>
                          <ProductTagEmpty />
                        </div>
                      );
                    }

                    // Show no results if no products and not loading
                    if (productOptions.length === 0 && !isLoadingProducts) {
                      return (
                        <div className={styles.mentionList}>
                          <ProductTagNoResult />
                        </div>
                      );
                    }

                    if (productOptions.length === 0 && isLoadingProducts)
                      return productMentionSkeletons;

                    // Show product list
                    return (
                      <div className={styles.mentionList}>
                        {productMentionList}
                        {isLoadingProducts && productMentionSkeletons}
                      </div>
                    );
                  },
                },
              ]}
            />
          </div>
          <Button
            icon={<Close />}
            className={styles.mentionContainer__closeButton}
            iconClassName={styles.mentionContainer__closeButton__icon}
            onPress={onCloseMenu}
          />
        </div>,
        menuRenderRef.current,
      )
    : null;
}
