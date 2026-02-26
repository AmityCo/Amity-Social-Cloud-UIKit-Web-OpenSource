import { Button } from '~/v4/core/components/AriaButton';
import { TagOutlined } from '~/v4/icons/TagOutlined';
import styles from './ProductTagBadge.module.css';
import { Typography } from '~/v4/core/components';
import { TagFilled } from '~/v4/icons/TagFilled';

interface ProductTagBadgeProps {
  selectedProductTags: Amity.ProductTag[];
  onClick?: () => void;
}

export function ProductTagBadge({ selectedProductTags, onClick }: ProductTagBadgeProps) {
  return (
    <Button
      variant="default"
      icon={selectedProductTags.length > 0 ? <TagFilled /> : <TagOutlined />}
      iconClassName={styles.productTagBadge__icon}
      className={styles.productTagBadge}
      onPress={onClick}
    >
      {selectedProductTags.length > 0 && (
        <Typography.CaptionBold className={styles.productTagBadge__count}>
          {selectedProductTags.length}
        </Typography.CaptionBold>
      )}
    </Button>
  );
}
