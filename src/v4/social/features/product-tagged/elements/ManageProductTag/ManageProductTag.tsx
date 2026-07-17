import React from 'react';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import { ActionButton } from '~/v4/core/components/ActionButton/ActionButton';
import { Button } from '~/v4/core/components/AriaButton';
import styles from './ManageProductTag.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { PAGE_ID, COMPONENT_ID, ELEMENT_ID } from '~/v4/constants/customization';
import { TrashIcon } from '~/v4/icons/Trash';
import { AnalyticsSourceTypeEnum } from '@amityco/ts-sdk';
import { ProductImageThumbnail } from '~/v4/social/features/product-tagged/internal-components/ProductImageThumbnail/ProductImageThumbnail';
import { formatPrice } from '~/v4/social/utils/formatPrice';
import { useNetworkState } from 'react-use';
import { PinStraight } from '~/v4/icons/PinStraight';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';

export type RenderModeEnum = 'livestream' | 'playback';

export interface ManageProductTagProps {
  sourceType?: AnalyticsSourceTypeEnum;
  sourceId: string;
  productTag: Amity.ProductTag;
  isPinned?: boolean;
  onRemove?: (productTag: Amity.ProductTag) => void;
  onTogglePin?: (productTag: Amity.ProductTag, isPinned: boolean) => void;
  pageId?: string;
  componentId?: string;
  isDisabled?: boolean;
  renderMode?: RenderModeEnum;
}

export function ManageProductTag({
  sourceId,
  productTag,
  isPinned = false,
  onRemove,
  onTogglePin,
  pageId = PAGE_ID.WILD_CARD,
  componentId = COMPONENT_ID.WILD_CARD,
  isDisabled = false,
  renderMode = 'livestream',
}: ManageProductTagProps) {
  const elementId = ELEMENT_ID.MANAGE_PRODUCT_TAG;
  const { themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  const { AmityGlobalBehavior } = usePageBehavior();

  const product = productTag.product;
  const unavailable = product?.status === 'archived';
  const price = product ? formatPrice(product.price, product.currency) : undefined;
  const { online } = useNetworkState();
  // useString is a hook — resolve unconditionally. This label used to be called inside the
  // `{unavailable && …}` block, so toggling availability changed the hook count (PDT-3913).
  const archivedInfoText = useString('amity_social_button_tagged_products_archived_info');

  if (!product) return null;

  const isLinkable = !unavailable && !!product.productUrl;

  const handlePress = () => {
    if (!isLinkable) return;
    AmityGlobalBehavior?.onLivestreamProductTagClick?.({ product });
  };

  const linkContent = (
    <>
      <ProductImageThumbnail
        imageUrl={product.thumbnailUrl}
        thumbnailMode={product.thumbnailMode}
        alt={product.productName || product.productId}
        size="large"
        isPinned={isPinned}
        unavailable={unavailable}
      />

      <div className={styles.manageProductTag__info}>
        <div className={styles.manageProductTag__top}>
          {unavailable && (
            <Typography.Caption as="p" className={styles.manageProductTag__unavailableLabel}>
              {archivedInfoText}
            </Typography.Caption>
          )}
          <Typography.BodyBold
            as="p"
            className={styles.manageProductTag__productName}
            data-unavailable={unavailable}
          >
            {product.productName || product.productId}
          </Typography.BodyBold>
        </div>

        <div className={styles.manageProductTag__bottomRow}>
          {!unavailable && price && (
            <Typography.Caption as="p" className={styles.manageProductTag__price}>
              {price}
            </Typography.Caption>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className={styles.manageProductTag} style={themeStyles} data-test-id={accessibilityId}>
      <div
        role="button"
        tabIndex={isLinkable ? 0 : -1}
        className={styles.manageProductTag__link}
        onClick={handlePress}
        data-linkable={isLinkable}
      >
        {linkContent}
      </div>
      <div className={styles.manageProductTag__actions}>
        <ActionButton
          className={styles.manageProductTag__removeButton}
          onPress={() => onRemove?.(productTag)}
          aria-label="Remove product tag"
          defaultIcon={<TrashIcon />}
          color="secondary"
          size="small"
          isDisabled={isDisabled || !online}
        />
        {renderMode === 'livestream' && !unavailable && (
          <Button
            className={styles.manageProductTag__pinButton}
            iconClassName={styles.manageProductTag__pinIcon}
            onPress={() => onTogglePin?.(productTag, !isPinned)}
            aria-label={
              isPinned
                ? useString('amity_social_unpin_product')
                : useString('amity_social_pin_product')
            }
            variant="outlined"
            size="small"
            icon={<PinStraight />}
            isDisabled={isDisabled || !online}
          >
            <Typography.CaptionBold as="span" className={styles.manageProductTag__pinButtonText}>
              {isPinned
                ? useString('amity_social_label_unpin_label')
                : useString('amity_social_label_pin_label')}
            </Typography.CaptionBold>
          </Button>
        )}
      </div>
    </div>
  );
}
