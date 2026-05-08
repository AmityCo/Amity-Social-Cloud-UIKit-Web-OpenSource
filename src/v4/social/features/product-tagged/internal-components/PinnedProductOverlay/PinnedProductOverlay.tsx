import React, { useEffect, useRef, useState } from 'react';
import { useString } from '~/v4/core/localization';
import useSDK from '~/v4/core/hooks/useSDK';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import { useLivestreamModeration } from '~/v4/social/features/livestream/hooks/useLivestreamModeration';
import { usePostSubscription } from '~/v4/social/features/livestream/hooks';
import { useTaggingProduct } from '~/v4/social/hooks/useTaggingProduct';
import useProductCatalogueSettings from '~/v4/social/hooks/useProductCatalogueSettings';
import { LivestreamPinnedProduct } from '~/v4/social/features/product-tagged/elements/LivestreamPinnedProduct';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';

export interface PinnedProductOverlayProps {
  pageId?: string;
  componentId?: string;
}

export const PinnedProductOverlay: React.FC<PinnedProductOverlayProps> = ({
  pageId,
  componentId,
}) => {
  const { currentUserId } = useSDK();
  const { success, info } = useNotifications();
  const { unpinProduct, updateProductTags } = useTaggingProduct();
  const { productCatalogueSettings } = useProductCatalogueSettings();
  const { AmityGlobalBehavior } = usePageBehavior();

  const { room, hostId, coHostId, livestreamPost } = useLivestreamData();

  const { post: subscribedParentPost } = usePostSubscription(livestreamPost?.postId);
  const { canCoHostManageProductTags } = useLivestreamModeration({ room });

  const pinnedProductId = livestreamPost?.pinnedProductId;

  const lastKnownPinnedTagRef = useRef<Amity.MediaProductTag | undefined>(undefined);

  const [dismissedPinnedProductId, setDismissedPinnedProductId] = useState<string | undefined>(
    undefined,
  );

  const isShowPinnedProduct = !!pinnedProductId && pinnedProductId !== dismissedPinnedProductId;
  const isHost = hostId === currentUserId;
  const isCoHost = coHostId === currentUserId;

  useEffect(() => {
    // When a new pinned product arrives, clear the dismissed state so it shows again
    if (pinnedProductId && pinnedProductId !== dismissedPinnedProductId) {
      setDismissedPinnedProductId(undefined);
    }
  }, [pinnedProductId]);

  const onUnpin = async () => {
    await unpinProduct(livestreamPost?.postId || '');
  };

  const onRemove = async () => {
    const updatedTags = livestreamPost?.productTags?.filter(
      (tag) => tag.productId !== pinnedProductId,
    );
    try {
      await updateProductTags({
        postId: livestreamPost?.postId || '',
        productTags: updatedTags || [],
        action: 'remove',
      });
      success({ content: useString('amity_social_label_product_tag_removed') });
    } catch (error) {
      info({
        content: useString('amity_social_toast_product_tag_remove_failed'),
      });
    }
  };

  // Don't render if post is pending review or product catalogue is disabled
  if (
    subscribedParentPost?.feedType === 'reviewing' ||
    !productCatalogueSettings?.product.enabled
  ) {
    return null;
  }

  if (!livestreamPost?.productTags || !pinnedProductId || !isShowPinnedProduct) {
    return null;
  }

  const pinnedTag = livestreamPost.productTags?.find((tag) => tag.productId === pinnedProductId);

  // Keep last known tag so the component stays mounted during brief sync gaps
  if (pinnedTag) {
    lastKnownPinnedTagRef.current = pinnedTag;
  }

  const tagToRender = pinnedTag ?? lastKnownPinnedTagRef.current;
  if (!tagToRender) return null;

  // User can manage if they're the host OR if they're the co-host with permission
  const canManage = isHost || (isCoHost && canCoHostManageProductTags);

  return (
    <LivestreamPinnedProduct
      key={pinnedProductId}
      pageId={pageId}
      componentId={componentId}
      productTag={tagToRender}
      isViewer={!canManage}
      sourceId={room?.roomId}
      onClosePinnedProduct={() => setDismissedPinnedProductId(pinnedProductId)}
      onUnpin={onUnpin}
      onRemove={onRemove}
      onProductLinkClick={(productTag) => {
        if (productTag.product) {
          AmityGlobalBehavior?.onLivestreamProductTagClick?.({
            product: productTag.product as Amity.Product,
          });
        }
      }}
    />
  );
};
