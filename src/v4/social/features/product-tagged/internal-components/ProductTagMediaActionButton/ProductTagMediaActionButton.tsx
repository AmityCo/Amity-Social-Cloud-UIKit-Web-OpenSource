import { Button } from '~/v4/core/components/AriaButton';
import { TagOutlined } from '~/v4/icons/TagOutlined';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import styles from './ProductTagMediaActionButton.module.css';
import { ProductTagSelectionWrapper } from './ProductTagSelectionWrapper';
import { Typography } from '~/v4/core/components';
import { TagFilled } from '~/v4/icons/TagFilled';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

interface ProductTagMediaActionButtonProps {
  selectedProductTags: Amity.ProductTag[];
  pageId?: string;
  onTagChanges: (tags: Amity.ProductTag[]) => void;
}

export function ProductTagMediaActionButton({
  pageId,
  selectedProductTags,
  onTagChanges,
}: ProductTagMediaActionButtonProps) {
  const { isDesktop } = useResponsive();
  const { openPopup, closePopup } = usePopupContext();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { success } = useNotifications();

  const handleDone = (tags: Amity.ProductTag[]) => {
    onTagChanges(tags);
    if (isDesktop) {
      closePopup('product-tag');
    } else {
      removeDrawerData();
    }
    success({ content: 'Product tags have been added.' });
  };

  return (
    <Button
      variant="default"
      icon={selectedProductTags.length > 0 ? <TagFilled /> : <TagOutlined />}
      iconClassName={styles.productTagMediaActionButton__icon}
      className={styles.productTagMediaActionButton}
      onPress={() => {
        if (isDesktop) {
          const popupId = 'product-tag';
          openPopup({
            id: popupId,
            pageId,
            view: 'desktop',
            children: (
              <ProductTagSelectionWrapper
                initialProductTags={selectedProductTags}
                pageId={pageId}
                displayMode="desktop"
                onClose={() => closePopup(popupId)}
                onDone={handleDone}
              />
            ),
            className: styles.productTagMediaActionButton__productTagSelection,
          });
        } else {
          setDrawerData({
            content: (
              <div className={styles.productTagMediaActionButton__productTagSelection}>
                <ProductTagSelectionWrapper
                  initialProductTags={selectedProductTags}
                  pageId={pageId}
                  displayMode="mobile"
                  onClose={() => removeDrawerData()}
                  onDone={handleDone}
                />
              </div>
            ),
          });
        }
      }}
    >
      {selectedProductTags.length > 0 && (
        <Typography.CaptionBold className={styles.productTagMediaActionButton__count}>
          {selectedProductTags.length}
        </Typography.CaptionBold>
      )}
    </Button>
  );
}
