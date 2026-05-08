import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveString } from '~/v4/core/localization';
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
        title: resolveString('amity_social_label_product_tagging_unavailable_title'),
        content: resolveString('amity_social_product_tagging_disabled_content'),
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
    onSuccess: () => success({ content: resolveString('amity_social_label_product_tag_pinned') }),
    onError: (error: Error) =>
      handleProductTagError(error, resolveString('amity_social_toast_pin_product_tag_failed')),
  });

  const {
    mutateAsync: unpinProduct,
    isPending: isUnpinning,
    isError: isUnpinError,
  } = useMutation({
    mutationFn: async (postId: string) => {
      return await PostRepository.unpinProduct(postId);
    },
    onSuccess: () => success({ content: resolveString('amity_social_label_product_tag_unpinned') }),
    onError: (error: Error) =>
      handleProductTagError(error, resolveString('amity_social_toast_unpin_product_tag_failed')),
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
        info({ content: resolveString('amity_social_toast_post_products_unavailable_toast') });
      }
    },
    onError: (error: Error, variables) => {
      const fallbackMessage =
        variables.action === 'remove'
          ? resolveString('amity_social_toast_product_tag_remove_failed')
          : resolveString('amity_social_toast_product_tag_add_failed');
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
