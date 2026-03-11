import { ActionButton } from '~/v4/core/components/ActionButton';
import { TagOutlined } from '~/v4/icons/TagOutlined';
import { ProductTagList } from '~/v4/social/features/product-tagged/components/ProductTagList';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import styles from './ProductTagActionButton.module.css';
import { Typography } from '~/v4/core/components';
import clsx from 'clsx';
import { TagLight } from '~/v4/icons/TagLight';

interface ProductTagActionButtonProps {
  productTags?: Amity.ProductTag[];
  pageId?: string;
  className?: string;
  sourceId?: string;
}

export function ProductTagActionButton({
  pageId,
  productTags = [],
  className = '',
}: ProductTagActionButtonProps) {
  const { isDesktop } = useResponsive();
  const { openPopup, closePopup } = usePopupContext();
  const { setDrawerData } = useDrawer();
  const productAmount = productTags.length;

  return (
    <div className={styles.productTagActionButton}>
      <ActionButton
        pageId={pageId}
        className={clsx(styles.productTagActionButton__button, className)}
        size={isDesktop ? 'medium' : 'large'}
        defaultIcon={isDesktop ? <TagLight /> : <TagOutlined />}
        color="secondary"
        onPress={() => {
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
              className: styles.productTagActionButton__productTagList,
            });
          } else {
            setDrawerData({
              content: (
                <div className={styles.productTagActionButton__productTagList}>
                  <ProductTagList productTags={productTags} pageId={pageId} displayMode="mobile" />
                </div>
              ),
            });
          }
        }}
      />
      {productAmount > 0 && (
        <div className={styles.productTagActionButton__amount}>
          <Typography.Body className={styles.productTagActionButton__amountText}>
            {productAmount}
          </Typography.Body>
        </div>
      )}
    </div>
  );
}
