import React, { useState, useCallback } from 'react';
import styles from './TaggedProductsModal.module.css';
import { Typography } from '~/v4/core/components';
import { Divider, DividerType } from '~/v4/social/elements/Divider/Divider';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { PAGE_ID, COMPONENT_ID } from '~/v4/constants/customization';
import {
  ManageProductTag,
  ProductTagNoTagsYet,
} from '~/v4/social/features/product-tagged/elements';
import { Button } from '~/v4/core/components/AriaButton';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { ProductTagSelectionWrapper } from '~/v4/social/features/product-tagged/internal-components/ProductTagSelectionWrapper';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import CloseIcon from '~/v4/icons/Close';
import { ActionButton } from '~/v4/core/components/ActionButton';
import { AnalyticsSourceTypeEnum } from '@amityco/ts-sdk';

type DrawerScreen = 'list' | 'selection';

const MAX_COUNT = 20;

export interface TaggedProductsModalProps {
  pageId?: string;
  roomId?: string;
  productTags: Amity.ProductTag[];
  pinnedProductId?: string;
  onClose?: () => void;
  isHost?: boolean;
  onRemove?: (productTag: Amity.ProductTag) => void;
  onTogglePin?: (productTag: Amity.ProductTag, isPinned: boolean) => void;
  isPinning?: boolean;
  isUnpinning?: boolean;
  onUpdateProductTags?: (tags: Amity.ProductTag[]) => void;
  onPinnedProductIdChange?: (pinnedProductId: string | undefined) => void;
}

export function TaggedProductsModal({
  productTags,
  roomId,
  pinnedProductId,
  pageId = PAGE_ID.WILD_CARD,
  onClose,
  isHost = false,
  onRemove,
  onTogglePin,
  isPinning = false,
  isUnpinning = false,
  onUpdateProductTags,
  onPinnedProductIdChange,
}: TaggedProductsModalProps) {
  const componentId = COMPONENT_ID.MANAGE_PRODUCT_TAG_LIST;
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { openPopup } = usePopupContext();
  const { isDesktop } = useResponsive();
  const [screen, setScreen] = useState<DrawerScreen>('list');

  const totalCount = productTags.length;

  const openSelection = useCallback(() => {
    if (isDesktop) {
      openPopup({
        id: 'product-tag-selection-modal',
        pageId,
        view: 'desktop',
        ariaLabel: 'Product Tag Selection Modal',
        children: ({ close }) => (
          <ProductTagSelectionWrapper
            renderMode="playback"
            initialProductTags={[]}
            alreadyTaggedProducts={productTags}
            pageId={pageId}
            displayMode="desktop"
            mode="livestream"
            maxCount={MAX_COUNT}
            pinnedProductId={pinnedProductId}
            onPinnedProductIdChange={onPinnedProductIdChange}
            isShowSearchProduct
            isFromManageTagList
            isHost={isHost}
            onUpdateProductTags={onUpdateProductTags}
            onClose={close}
          />
        ),
      });
      return;
    }

    setScreen('selection');
  }, [
    isDesktop,
    openPopup,
    pageId,
    productTags,
    pinnedProductId,
    onPinnedProductIdChange,
    isHost,
    onUpdateProductTags,
  ]);

  if (!isDesktop && screen === 'selection') {
    return (
      <ProductTagSelectionWrapper
        renderMode="playback"
        initialProductTags={[]}
        alreadyTaggedProducts={productTags}
        pageId={pageId}
        displayMode="mobile"
        mode="livestream"
        maxCount={MAX_COUNT}
        pinnedProductId={pinnedProductId}
        onPinnedProductIdChange={onPinnedProductIdChange}
        onUpdateProductTags={onUpdateProductTags}
        isShowSearchProduct
        isFromManageTagList
        isHost={isHost}
        onDone={(tags) => {
          onUpdateProductTags?.(tags);
          setScreen('list');
        }}
        onClose={() => setScreen('list')}
      />
    );
  }

  return (
    <div className={styles.taggedProductsModal} style={themeStyles} data-test-id={accessibilityId}>
      {/* Header */}
      <div className={styles.taggedProductsModal__header}>
        <div className={styles.taggedProductsModal__headerContent}>
          {!isDesktop && <div className={styles.taggedProductsModal__spacer} />}
          <div className={styles.taggedProductsModal__header__tileContainer}>
            <Typography.TitleBold className={styles.taggedProductsModal__title}>
              {isHost ? 'Tagged products' : 'Products tagged'}
            </Typography.TitleBold>
            {isHost && (
              <Typography.Caption className={styles.taggedProductsModal__description}>
                {totalCount}/{MAX_COUNT}
              </Typography.Caption>
            )}
          </div>

          {!isDesktop && (
            <ActionButton
              size="large"
              aria-label="close tagged products modal"
              className={styles.taggedProductsModal__closeButton}
              defaultIcon={<CloseIcon />}
              iconClassName={styles.taggedProductsModal__closeIcon}
              onPress={onClose}
            />
          )}
        </div>
      </div>

      <Divider type={DividerType.FULL_WIDTH} />

      {/* Content */}
      <div className={styles.taggedProductsModal__content}>
        {totalCount === 0 ? (
          isHost ? (
            <ProductTagNoTagsYet
              pageId={pageId}
              componentId={componentId}
              onPress={openSelection}
            />
          ) : null
        ) : (
          <div
            className={styles.taggedProductsModal__list}
            key={productTags.map((p) => p.productId).join('-')}
          >
            {productTags.map((productTag) => (
              <ManageProductTag
                key={productTag.productId}
                sourceId={roomId as string}
                sourceType={AnalyticsSourceTypeEnum.ROOM}
                isHost={isHost}
                renderMode="playback"
                productTag={productTag}
                onRemove={onRemove}
                onTogglePin={isHost ? onTogglePin : undefined}
                pageId={pageId}
                componentId={componentId}
                isDisabled={isPinning || isUnpinning}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer - Only show "Add products" button for hosts */}
      {isHost && totalCount > 0 && (
        <>
          <Divider type={DividerType.FULL_WIDTH} />
          <div className={styles.taggedProductsModal__footer}>
            <Button
              variant="text"
              fullWidth
              onPress={openSelection}
              className={styles.taggedProductsModal__addButton}
            >
              <Typography.BodyBold>Add products</Typography.BodyBold>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
