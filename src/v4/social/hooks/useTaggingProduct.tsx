import { useMutation } from '@tanstack/react-query';
import { PostRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

export const useTaggingProduct = () => {
  const { success, info } = useNotifications();

  const {
    mutateAsync: pinProduct,
    isPending: isPinning,
    isError: isPinError,
  } = useMutation({
    mutationFn: async ({ postId, productId }: { postId: string; productId: string }) => {
      return await PostRepository.pinProduct(postId, productId);
    },
    onSuccess: () => success({ content: 'Product tag pinned.' }),
    onError: () => info({ content: 'Failed to pin product tag. Please try again.' }),
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
    onError: () => info({ content: 'Failed to unpin product tag. Please try again.' }),
  });

  const {
    mutateAsync: updateProductTags,
    isPending: isUpdating,
    isError: isUpdateError,
  } = useMutation({
    mutationFn: async ({
      postId,
      productTags,
    }: {
      postId: string;
      productTags: Amity.MediaProductTag[];
    }) => {
      return await PostRepository.updateProductTags(postId, productTags);
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
