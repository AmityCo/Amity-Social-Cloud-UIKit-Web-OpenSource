import React, { useCallback, useState, useEffect } from 'react';
import { useString } from '~/v4/core/localization';
import styles from './ManageProductTagList.module.css';
import { COMPONENT_ID } from '~/v4/constants/customization';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import { CloseButton } from '~/v4/social/elements';
import { Button } from '~/v4/core/components/AriaButton';
import { ManageProductTag } from '~/v4/social/features/product-tagged/elements/ManageProductTag';
import { Divider, DividerType } from '~/v4/social/elements/Divider';
import { ProductTagSelection } from '~/v4/social/features/product-tagged/components/ProductTagSelection';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { DisplayModeEnum } from '~/v4/social/types';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { RenderModeEnum } from '~/v4/social/features/product-tagged/elements/ManageProductTag/ManageProductTag';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { AnalyticsSourceTypeEnum } from '@amityco/ts-sdk';
import { Notification } from '~/v4/core/components/Notification';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import { useNetworkState } from 'react-use';

export interface ManageProductTagListProps {
  //to remove product
  productTags?: Amity.MediaProductTag[];
  onProductTagsChange?: (tags: Amity.ProductTag[]) => void;
  onUpdateProductTags?: (
    tags: Amity.ProductTag[],
  ) => Promise<Amity.ProductTag[] | undefined> | void;
  onRemove?: (productTag: Amity.ProductTag) => void;
  pageId?: string;
  onClose: (tags: Amity.ProductTag[], pinnedProductId: string) => void;
  maxCount?: number;
  // to pin/unpin product
  pinnedProductId?: string;
  onPinnedProductIdChange?: (pinnedProductId: string | undefined) => void;
  // loading states
  isPinning?: boolean;
  isUnpinning?: boolean;
  renderMode?: RenderModeEnum;
  isHost?: boolean;
  sourceType?: AnalyticsSourceTypeEnum;
  sourceId: string;
}

export function ManageProductTagList({
  productTags: initialProductTags,
  onProductTagsChange,
  onUpdateProductTags,
  onRemove,
  pageId = '*',
  onClose,
  maxCount = 20,
  pinnedProductId,
  onPinnedProductIdChange,
  isPinning = false,
  isUnpinning = false,
  renderMode = 'livestream',
  isHost = false,
  sourceType,
  sourceId,
}: ManageProductTagListProps) {
  const componentId = COMPONENT_ID.MANAGE_PRODUCT_TAG_LIST;
  const { isDesktop } = useResponsive();
  const { openPopup, closePopup } = usePopupContext();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { confirm } = useConfirmContext();

  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const [productTags, setProductTags] = useState<Amity.ProductTag[] | undefined>(
    initialProductTags || [],
  );
  const [localPinnedProductId, setLocalPinnedProductId] = useState<string | undefined>(
    pinnedProductId,
  );

  // Sync local state when the parent pushes updated product tags (e.g. external changes via subscription)
  useEffect(() => {
    setProductTags(initialProductTags || []);
  }, [initialProductTags]);

  // Sync local pinned state when the parent pushes an updated pinnedProductId
  useEffect(() => {
    setLocalPinnedProductId(pinnedProductId);
  }, [pinnedProductId]);

  const { online } = useNetworkState();
  const { success, info } = useNotifications();
  const discardProductSelectionTitle = useString(
    'amity_social_modal_dialog_title_discard_product_selection',
  );
  const unsavedProductsText = useString('amity_social_unsaved_products');
  const discardText = useString('amity_social_button_discard');
  const keepEditingText = useString('amity_social_button_keep_editing');
  const productTagRemovedText = useString('amity_social_label_product_tag_removed');
  const productTagRemoveFailedText = useString('amity_social_toast_product_tag_remove_failed');

  const handleRemove = async (productTag: Amity.ProductTag) => {
    const previousTags = productTags;
    const previousPinnedId = localPinnedProductId;
    const updatedTags = productTags?.filter((tag) => tag.productId !== productTag.productId);

    // Optimistically update UI
    setProductTags(updatedTags);
    updatedTags && onProductTagsChange?.(updatedTags);

    // Clear local pinned state if it was pinned
    if (localPinnedProductId === productTag.productId) {
      setLocalPinnedProductId(undefined);
    }

    // Call API to remove product - use onRemove if provided (with specific toast)
    try {
      if (onRemove) {
        await onRemove(productTag);
      } else if (onUpdateProductTags && updatedTags) {
        await onUpdateProductTags(updatedTags);
        success({
          content: productTagRemovedText,
        });
      }
    } catch (error) {
      // Show error message
      info({
        content: productTagRemoveFailedText,
      });
      // Rollback UI state on failure
      setProductTags(previousTags);
      onProductTagsChange?.(previousTags || []);
      setLocalPinnedProductId(previousPinnedId);
    }
  };

  const handleTogglePin = (productTag: Amity.ProductTag, shouldPin: boolean) => {
    if (shouldPin) {
      // When pinning a new product, clear all existing pins and set only the new one
      setLocalPinnedProductId(productTag.productId);
      onPinnedProductIdChange?.(productTag.productId);
    } else {
      // When unpinning, just remove the product from pinned
      setLocalPinnedProductId(undefined);
      onPinnedProductIdChange?.(undefined);
    }
  };

  const onCloseAddProductTag = useCallback(
    (selectedProducts: Amity.ProductTag[]) => {
      const hasUnsavedChanges = selectedProducts.length > 0;

      if (hasUnsavedChanges) {
        confirm({
          type: 'confirm',
          title: discardProductSelectionTitle,
          content: unsavedProductsText,
          okText: discardText,
          cancelText: keepEditingText,
          okButtonColor: 'alert',
          onOk: () => {
            closePopup();
          },
        });
      } else {
        closePopup();
      }
    },
    [closePopup, confirm],
  );

  // Separate pinned and unpinned products
  const pinnedProducts = productTags?.filter((tag) => localPinnedProductId === tag.productId) || [];
  const otherProducts = productTags?.filter((tag) => localPinnedProductId !== tag.productId) || [];

  const handleAddProducts = () => {
    const popupId = 'add-product-tags';

    const productTagSelectionContent = (close: () => void) => (
      <ProductTagSelection
        selectedProductTags={productTags}
        onTagChanges={(updatedTags) => {
          setProductTags(updatedTags);
          onProductTagsChange?.(updatedTags);
        }}
        onUpdateProductTags={onUpdateProductTags}
        displayMode={isDesktop ? DisplayModeEnum.DESKTOP : DisplayModeEnum.MOBILE}
        mode="livestream"
        pageId={pageId}
        onDone={() => {
          close();
        }}
        onClose={(localSelectedProduct) => {
          onCloseAddProductTag(localSelectedProduct || []);
        }}
        maxCount={maxCount}
        isFromManageTagList={true}
        isHost={isHost}
        pinnedProductId={localPinnedProductId}
        onPinnedProductIdChange={(newPinnedId) => {
          setLocalPinnedProductId(newPinnedId);
          onPinnedProductIdChange?.(newPinnedId);
        }}
      />
    );

    if (isDesktop) {
      // Desktop: show in popup
      closePopup(popupId);
      openPopup({
        id: popupId,
        pageId,
        view: 'desktop',
        isDismissable: true,
        children: ({ close }) => productTagSelectionContent(close),
      });
    } else {
      // Mobile: show in drawer
      setDrawerData({
        content: productTagSelectionContent(() => removeDrawerData()),
        ariaLabel: useString('amity_social_button_tagged_products_empty_action'),
      });
    }
  };

  // When remove product until empty
  const handleNavigateToAddProduct = useCallback(() => {
    const popupId = 'add-product-tags';

    onClose?.(productTags || [], localPinnedProductId || '');

    const productTagSelectionContent = (close: () => void) => (
      <ProductTagSelection
        selectedProductTags={productTags}
        onTagChanges={(updatedTags) => {
          setProductTags(updatedTags);
          onClose?.(updatedTags, localPinnedProductId || '');
        }}
        onUpdateProductTags={onUpdateProductTags}
        displayMode={isDesktop ? DisplayModeEnum.DESKTOP : DisplayModeEnum.MOBILE}
        mode="livestream"
        pageId={pageId}
        onDone={() => {
          close();
        }}
        onClose={(localSelectedProduct) => onCloseAddProductTag(localSelectedProduct || [])}
        maxCount={maxCount}
        isFromManageTagList={true}
        isHost={isHost}
        pinnedProductId={localPinnedProductId}
        onPinnedProductIdChange={(newPinnedId) => {
          setLocalPinnedProductId(newPinnedId);
          onPinnedProductIdChange?.(newPinnedId);
        }}
      />
    );

    if (isDesktop) {
      closePopup();
      openPopup({
        id: popupId,
        pageId,
        view: 'desktop',
        isDismissable: true,
        children: ({ close }) => productTagSelectionContent(close),
      });
    } else {
      setDrawerData({
        content: productTagSelectionContent(() => removeDrawerData()),
        ariaLabel: useString('amity_social_button_tagged_products_empty_action'),
      });
    }
  }, [
    productTags,
    localPinnedProductId,
    onClose,
    onUpdateProductTags,
    isDesktop,
    pageId,
    onCloseAddProductTag,
    maxCount,
    isHost,
    onPinnedProductIdChange,
    closePopup,
    openPopup,
    setDrawerData,
    removeDrawerData,
  ]);

  // Automatically navigate to add products when list becomes empty
  useEffect(() => {
    if (productTags?.length === 0) {
      handleNavigateToAddProduct();
    }
  }, [productTags?.length, handleNavigateToAddProduct]);

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.manageProductTagList}>
      {!online && (
        <Notification
          icon={<Spinner />}
          content={useString('amity_social_label_waiting_for_network')}
          alignment="fixed"
        />
      )}
      <div className={styles.manageProductTagList__header}>
        <div className={styles.manageProductTagList__headerContent}>
          {!isDesktop && <div className={styles.manageProductTagList__emptySpace} />}
          <Typography.TitleBold as="h2" className={styles.manageProductTagList__title}>
            {useString('amity_social_button_tagged_products')}
          </Typography.TitleBold>
          <Typography.Caption as="p" className={styles.manageProductTagList__description}>
            {productTags?.length}/{maxCount}
          </Typography.Caption>
        </div>
        <CloseButton
          pageId={pageId}
          componentId={componentId}
          onPress={() => {
            onClose(productTags || [], localPinnedProductId || '');
          }}
          defaultClassName={styles.manageProductTagList__closeButton}
        />
      </div>

      <Divider type={DividerType.FULL_WIDTH} />

      <div className={styles.manageProductTagList__content}>
        {productTags?.length === 0 ? null : (
          <>
            {renderMode === 'playback' ? (
              <div className={styles.manageProductTagList__scrollableContent}>
                <div className={styles.manageProductTagList__list}>
                  {productTags?.map((productTag) => (
                    <ManageProductTag
                      key={productTag.productId}
                      renderMode={renderMode}
                      productTag={productTag}
                      isPinned={false}
                      onRemove={handleRemove}
                      onTogglePin={handleTogglePin}
                      sourceType={sourceType}
                      sourceId={sourceId}
                      pageId={pageId}
                      componentId={componentId}
                      isDisabled={!online}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {pinnedProducts.length > 0 && (
                  <div className={styles.manageProductTagList__pinnedSection}>
                    <div className={styles.manageProductTagList__sectionTitle}>
                      <Typography.TitleBold as="h3">
                        {useString('amity_social_label_pinned_product_label')}
                      </Typography.TitleBold>
                    </div>

                    <div className={styles.manageProductTagList__pinnedContent}>
                      <div className={styles.manageProductTagList__pinnedList}>
                        {pinnedProducts.map((productTag) => (
                          <ManageProductTag
                            sourceType={sourceType}
                            sourceId={sourceId as string}
                            key={productTag.productId}
                            renderMode={renderMode}
                            productTag={productTag}
                            isPinned={true}
                            onRemove={handleRemove}
                            onTogglePin={handleTogglePin}
                            pageId={pageId}
                            componentId={componentId}
                            isDisabled={isPinning || isUnpinning || !online}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {otherProducts.length > 0 && (
                  <div className={styles.manageProductTagList__otherSection}>
                    <div className={styles.manageProductTagList__sectionTitle}>
                      <Typography.TitleBold as="h3">
                        {useString('amity_social_label_other_products_label')}
                      </Typography.TitleBold>
                    </div>
                    <div className={styles.manageProductTagList__scrollableContent}>
                      <div className={styles.manageProductTagList__list}>
                        {otherProducts.map((productTag) => (
                          <ManageProductTag
                            key={productTag.productId}
                            renderMode={renderMode}
                            productTag={productTag}
                            isPinned={false}
                            onRemove={handleRemove}
                            onTogglePin={handleTogglePin}
                            sourceType={sourceType}
                            sourceId={sourceId}
                            pageId={pageId}
                            componentId={componentId}
                            isDisabled={isPinning || isUnpinning || !online}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className={styles.manageProductTagList__footer}>
              <Button
                className={styles.manageProductTagList__addButton}
                data-isDisabled={productTags?.length === maxCount || !online}
                onPress={handleAddProducts}
                variant="text"
                fullWidth
                isDisabled={productTags?.length === maxCount || !online}
              >
                <Typography.BodyBold as="span">
                  {useString('amity_social_button_add_products')}
                </Typography.BodyBold>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
