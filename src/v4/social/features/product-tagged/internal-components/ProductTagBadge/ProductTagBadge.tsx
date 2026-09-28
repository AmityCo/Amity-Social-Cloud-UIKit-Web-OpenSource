import { Button } from '~/v4/core/components/AriaButton';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ELEMENT_ID } from '~/v4/constants/customization';
import { TagOutlined } from '~/v4/icons/TagOutlined';
import styles from './ProductTagBadge.module.css';
import { Typography } from '~/v4/core/components';
import { TagFilled } from '~/v4/icons/TagFilled';

interface ProductTagBadgeProps {
  selectedProductTags: Amity.ProductTag[];
  onClick?: () => void;
  pageId?: string;
  /**
   * The positioned box this badge sits in, drawn here rather than around the
   * call site. A caller that framed it kept its own wrapper when the badge
   * returned null, and a hole where a badge was is worse than the badge: the
   * thumbnails each frame it twice, and four wrappers asking the gate
   * themselves would have been four more hooks and four more chances to miss
   * one.
   */
  wrapperClassName?: string;
}

export function ProductTagBadge({
  selectedProductTags,
  onClick,
  pageId,
  wrapperClassName,
}: ProductTagBadgeProps) {
  // Gated here as well as at each thumbnail that frames it, for the reason
  // ProductTagButton gives: thirteen call sites would have been thirteen
  // chances to forget one. The badge rendered on a media thumbnail with Product
  // switched off, counting tags for a module the network did not buy.
  const { accessibilityId, isExcluded } = useAmityElement({
    pageId: pageId ?? '*',
    componentId: '*',
    elementId: ELEMENT_ID.PRODUCT_TAG,
  });

  if (isExcluded) return null;

  const badge = (
    <Button
      variant="default"
      icon={selectedProductTags.length > 0 ? <TagFilled /> : <TagOutlined />}
      iconClassName={styles.productTagBadge__icon}
      className={styles.productTagBadge}
      // Named so its absence is provable rather than a matter of reading a
      // class name off the DOM.
      data-testid={accessibilityId}
      onPress={onClick}
    >
      {selectedProductTags.length > 0 && (
        <Typography.CaptionBold className={styles.productTagBadge__count}>
          {selectedProductTags.length}
        </Typography.CaptionBold>
      )}
    </Button>
  );

  return wrapperClassName ? <div className={wrapperClassName}>{badge}</div> : badge;
}
