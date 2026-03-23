import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { ProductTagSelectionWrapper } from '~/v4/social/features/product-tagged/internal-components/ProductTagSelectionWrapper';

type MediaType = 'image' | 'video';

interface UseProductTagSelectionOptions<T extends MediaType> {
  pageId?: string;
  onFileProductTagsChange?: (file: Amity.File<T>, tags: Amity.ProductTag[]) => void;
  onChildPostProductTagsChange?: (postId: string, tags: Amity.ProductTag[]) => void;
  taggedProductIds?: string[];
}

export const useProductTagSelection = <T extends MediaType = MediaType>({
  pageId,
  onFileProductTagsChange,
  onChildPostProductTagsChange,
  taggedProductIds = [],
}: UseProductTagSelectionOptions<T>) => {
  const { isDesktop } = useResponsive();
  const { openPopup, closePopup } = usePopupContext();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { success } = useNotifications();

  const openProductTagSelection = ({
    file,
    postId,
    initialProductTags,
    remainingLimit,
  }: {
    file?: Amity.File<T>;
    postId?: string;
    initialProductTags?: Amity.ProductTag[];
    remainingLimit?: number;
  }) => {
    const handleDone = (tags: Amity.ProductTag[]) => {
      file && onFileProductTagsChange?.(file, tags);
      postId && onChildPostProductTagsChange?.(postId, tags);

      if (isDesktop) {
        closePopup('product-tag');
      } else {
        removeDrawerData();
      }

      const hadInitialTags = initialProductTags && initialProductTags.length > 0;
      success({
        content: hadInitialTags
          ? 'Product tags have been updated.'
          : 'Product tags have been added.',
      });
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
            remainingLimit={remainingLimit}
            taggedProductIds={taggedProductIds}
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
            remainingLimit={remainingLimit}
            taggedProductIds={taggedProductIds}
          />
        ),
      });
    }
  };

  return { openProductTagSelection };
};
