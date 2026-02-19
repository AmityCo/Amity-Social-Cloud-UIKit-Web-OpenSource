import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { ProductTagSelectionWrapper } from '~/v4/social/features/product-tagged/internal-components/ProductTagSelectionWrapper';

type MediaType = 'image' | 'video';

interface UseProductTagSelectionOptions<T extends MediaType> {
  pageId?: string;
  onProductTagsChange?: (file: Amity.File<T>, tags: Amity.ProductTag[]) => void;
}

export const useProductTagSelection = <T extends MediaType = MediaType>({
  pageId,
  onProductTagsChange,
}: UseProductTagSelectionOptions<T>) => {
  const { isDesktop } = useResponsive();
  const { openPopup, closePopup } = usePopupContext();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { success } = useNotifications();

  const openProductTagSelection = (
    file: Amity.File<T>,
    initialProductTags?: Amity.ProductTag[],
  ) => {
    if (!onProductTagsChange) return;

    const handleDone = (tags: Amity.ProductTag[]) => {
      onProductTagsChange(file, tags);
      if (isDesktop) {
        closePopup('product-tag');
      } else {
        removeDrawerData();
      }
      success({ content: 'Product tags have been added.' });
    };

    if (isDesktop) {
      const popupId = 'product-tag';
      openPopup({
        id: popupId,
        pageId,
        view: 'desktop',
        children: (
          <ProductTagSelectionWrapper
            initialProductTags={initialProductTags ?? []}
            pageId={pageId}
            displayMode="desktop"
            onClose={() => closePopup(popupId)}
            onDone={handleDone}
          />
        ),
      });
    } else {
      setDrawerData({
        content: (
          <ProductTagSelectionWrapper
            initialProductTags={initialProductTags ?? []}
            pageId={pageId}
            displayMode="mobile"
            onClose={() => removeDrawerData()}
            onDone={handleDone}
          />
        ),
      });
    }
  };

  return { openProductTagSelection };
};
