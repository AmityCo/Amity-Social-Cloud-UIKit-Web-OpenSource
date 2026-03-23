import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PostRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { ERROR_CODE } from '~/v4/social/constants/errorResponse';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';

export const useTaggingProduct = ({
  onProductCatalogueDisabled,
}: { onProductCatalogueDisabled?: () => void } = {}) => {
  const { success, info } = useNotifications();
  const { info: infoPopup } = useConfirmContext();
  const { closePopup } = usePopupContext();
  const { removeDrawerData } = useDrawer();
  const queryClient = useQueryClient();

  const disableProductCatalogue = () => {
    closePopup();
    removeDrawerData();
    queryClient.setQueryData(
      ['asc-uikit', 'ProductCatalogueSettings'],
      (prev: Amity.ProductCatalogueSetting | null | undefined) =>
        prev ? { ...prev, product: { ...prev.product, enabled: false } } : prev,
    );
    onProductCatalogueDisabled?.();
  };

  const handleProductTagError = (error: Error, fallbackMessage: string) => {
    if (error instanceof Error && error.message.includes(ERROR_CODE.DISABLED_PRODUCT_TAG)) {
      infoPopup({
        title: `Product tagging isn't available`,
        content: `You can no longer manage tagged products in this live stream. Any tagged products have been removed and won't be shown to viewers.`,
        onOk: () => {
          disableProductCatalogue();
        },
        onCancel: () => {
          disableProductCatalogue();
        },
      });
    } else {
      info({ content: fallbackMessage });
    }
  };

  const {
    mutateAsync: pinProduct,
    isPending: isPinning,
    isError: isPinError,
  } = useMutation({
    mutationFn: async ({ postId, productId }: { postId: string; productId: string }) => {
      return await PostRepository.pinProduct(postId, productId);
    },
    onSuccess: () => success({ content: 'Product tag pinned.' }),
    onError: (error: Error) =>
      handleProductTagError(error, 'Failed to pin product tag. Please try again.'),
  });

  const {
    mutateAsync: unpinProduct,
    isPending: isUnpinning,
    isError: isUnpinError,
  } = useMutation({
    mutationFn: async (postId: string) => {
      return await PostRepository.unpinProduct(postId);
    },
    onSuccess: () => success({ content: 'Product tag unpinned.' }),
    onError: (error: Error) =>
      handleProductTagError(error, 'Failed to unpin product tag. Please try again.'),
  });

  const {
    mutateAsync: updateProductTags,
    isPending: isUpdating,
    isError: isUpdateError,
  } = useMutation({
    mutationFn: async ({
      postId,
      productTags,
      action,
    }: {
      postId: string;
      productTags: Amity.MediaProductTag[];
      action: 'add' | 'remove';
    }) => {
      return await PostRepository.updateProductTags(postId, productTags);
    },
    onSuccess: ({ data }) => {
      const productTags = data?.productTags;

      const hasUnavailableProducts = productTags?.some(
        (tag: Amity.ProductTag) => !tag.product || tag.product.status === 'archived',
      );

      if (hasUnavailableProducts) {
        info({ content: 'Some products that you’ve tagged are no longer available.' });
      }
    },
    onError: (error: Error, variables) => {
      const fallbackMessage =
        variables.action === 'remove'
          ? 'Failed to remove product tag. Please try again.'
          : 'Failed to add product tags. Please try again.';
      handleProductTagError(error, fallbackMessage);
    },
  });

  return {
    pinProduct,
    unpinProduct,
    updateProductTags,
    isUpdating,
    isUpdateError,
    isPinning,
    isUnpinning,
    isPinError,
    isUnpinError,
  };
};
export default useTaggingProduct;
