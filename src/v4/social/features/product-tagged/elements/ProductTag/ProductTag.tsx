import React from 'react';
import { Typography } from '~/v4/core/components';
import styles from './ProductTag.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { PAGE_ID, COMPONENT_ID, ELEMENT_ID } from '~/v4/constants/customization';
import { ProductImageThumbnail } from '~/v4/social/features/product-tagged/internal-components/ProductImageThumbnail/ProductImageThumbnail';
import { formatPrice } from '~/v4/social/utils/formatPrice';
import { Button } from '~/v4/core/components/AriaButton';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';

export interface ProductTagProps {
  product: Amity.Product;
  pageId?: string;
  componentId?: string;
  mode?: 'post' | 'livestream';
  isPinned?: boolean;
  onPress?: () => void;
}

export function ProductTag({
  product,
  pageId = PAGE_ID.WILD_CARD,
  componentId = COMPONENT_ID.WILD_CARD,
  mode = 'post',
  isPinned = false,
  onPress,
}: ProductTagProps) {
  const elementId = ELEMENT_ID.PRODUCT_TAG;
  const { themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const { info } = useConfirmContext();
  const { closePopup } = usePopupContext();

  const unavailable = product.status === 'inactive' || product.isDeleted;

  const imageUrl = product.thumbnailUrl;
  const price = formatPrice(product.price, product.currency);

  const handleUnavailableClick = () => {
    info({
      title: "Product tagging isn't available",
      content:
        "You can no longer manage tagged products in this live stream. Any tagged products have been removed and won't be shown to viewers.",
      okText: 'OK',
      shownCancelButton: false,
      onOk: () => {
        closePopup();
      },
    });
  };

  const handlePress = () => {
    if (unavailable) {
      handleUnavailableClick();
    } else {
      onPress?.();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (unavailable) {
      e.preventDefault();
      e.stopPropagation();
      handleUnavailableClick();
    }
  };

  return (
    <div
      className={styles.productTag}
      style={themeStyles}
      data-test-id={accessibilityId}
      data-mode={mode}
      data-unavailable={unavailable}
      onClick={handleClick}
    >
      <div className={styles.productTag__thumbnail}>
        <ProductImageThumbnail
          imageUrl={imageUrl}
          alt={product.productName || product.productId}
          size="large"
          isPinned={isPinned}
          unavailable={unavailable}
        />
      </div>
      <div className={styles.productTag__information} data-mode={mode}>
        <div className={styles.productTag__content} data-mode={mode}>
          {unavailable && (
            <Typography.Caption as="p" className={styles.productTag__unavailableLabel}>
              Unavailable
            </Typography.Caption>
          )}
          <Typography.BodyBold
            as="p"
            className={styles.productTag__title}
            data-unavailable={unavailable}
          >
            {product.productName || product.productId}
          </Typography.BodyBold>
          {!unavailable && price && (
            <Typography.Caption as="p" className={styles.productTag__price}>
              {price}
            </Typography.Caption>
          )}
        </div>

        {mode === 'livestream' && (
          <Button
            variant="fill"
            color="primary"
            className={styles.productTag__viewButton}
            onPress={handlePress}
            isDisabled={unavailable}
          >
            <Typography.CaptionBold as="span">View</Typography.CaptionBold>
          </Button>
        )}
      </div>
    </div>
  );
}
