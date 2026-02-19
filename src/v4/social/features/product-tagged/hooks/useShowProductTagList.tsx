import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { ProductTagList } from '~/v4/social/features/product-tagged/components/ProductTagList';
import { ProductTagListRenderMode } from '~/v4/social/types';

interface UseShowProductTagListOptions {
  pageId?: string;
  mode?: ProductTagListRenderMode;
}

export const useShowProductTagList = ({
  pageId,
  mode = 'post',
}: UseShowProductTagListOptions = {}) => {
  const { isDesktop } = useResponsive();
  const { openPopup, closePopup } = usePopupContext();
  const { setDrawerData, removeDrawerData } = useDrawer();

  const showProductTagList = (productTags: Amity.ProductTag[]) => {
    if (!productTags || productTags.length === 0) return;

    if (isDesktop) {
      const popupId = 'product-tag-list';
      openPopup({
        id: popupId,
        pageId,
        view: 'desktop',
        children: (
          <ProductTagList
            productTags={productTags}
            displayMode="desktop"
            pageId={pageId}
            onClose={() => closePopup(popupId)}
            mode={mode}
          />
        ),
      });
    } else {
      setDrawerData({
        content: (
          <ProductTagList
            productTags={productTags}
            displayMode="mobile"
            pageId={pageId}
            onClose={() => removeDrawerData()}
            mode={mode}
          />
        ),
      });
    }
  };

  return { showProductTagList };
};
