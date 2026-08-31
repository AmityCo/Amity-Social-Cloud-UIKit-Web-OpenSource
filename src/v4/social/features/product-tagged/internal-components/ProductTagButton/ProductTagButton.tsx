import clsx from 'clsx';
import { ActionButton } from '~/v4/core/components/ActionButton';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { TagOutlined } from '~/v4/icons/TagOutlined';
import { TagLight } from '~/v4/icons/TagLight';
import ChevronRight from '~/v4/icons/ChevronRight';
import { useString } from '~/v4/core/localization';
import { ProductTagList } from '~/v4/social/features/product-tagged/components/ProductTagList';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import styles from './ProductTagButton.module.css';

type ProductTagButtonVariant = 'compact' | 'detailed';

interface ProductTagButtonProps {
  productTags?: Amity.ProductTag[];
  pageId?: string;
  className?: string;
  sourceId?: string;
  variant?: ProductTagButtonVariant;
}

export function ProductTagButton({
  pageId,
  productTags = [],
  className = '',
  variant = 'compact',
}: ProductTagButtonProps) {
  const { isDesktop } = useResponsive();
  const { openPopup, closePopup } = usePopupContext();
  const { setDrawerData } = useDrawer();
  const tagProductsLabel = useString('amity_social_button_tag_products');
  const productAmount = productTags.length;

  const openProductTagList = () => {
    if (isDesktop) {
      const popupId = 'product-tag';
      openPopup({
        id: popupId,
        pageId,
        view: 'desktop',
        children: (
          <ProductTagList
            productTags={productTags}
            pageId={pageId}
            displayMode="desktop"
            onClose={() => closePopup(popupId)}
          />
        ),
        className: styles.productTagButton__productTagList,
      });
    } else {
      setDrawerData({
        content: (
          <div className={styles.productTagButton__productTagList}>
            <ProductTagList productTags={productTags} pageId={pageId} displayMode="mobile" />
          </div>
        ),
      });
    }
  };

  if (variant === 'detailed') {
    return (
      <Button
        type="button"
        onPress={openProductTagList}
        className={clsx(styles.productTagButton__row, className)}
      >
        <span className={styles.productTagButton__row__leading}>
          <TagOutlined className={styles.productTagButton__row__icon} />
          <Typography.BodyBold>{tagProductsLabel}</Typography.BodyBold>
        </span>
        <span className={styles.productTagButton__row__trailing}>
          <Typography.Body className={styles.productTagButton__row__count}>
            {productAmount}
          </Typography.Body>
          <ChevronRight className={styles.productTagButton__row__chevron} />
        </span>
      </Button>
    );
  }

  return (
    <div className={styles.productTagButton}>
      <ActionButton
        pageId={pageId}
        className={clsx(styles.productTagButton__button, className)}
        size="medium"
        defaultIcon={isDesktop ? <TagLight /> : <TagOutlined />}
        color="secondary"
        onPress={openProductTagList}
      />
      {productAmount > 0 && (
        <div className={styles.productTagButton__amount}>
          <Typography.Body className={styles.productTagButton__amountText}>
            {productAmount}
          </Typography.Body>
        </div>
      )}
    </div>
  );
}
