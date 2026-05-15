import React from 'react';
import { useString } from '~/v4/core/localization';
import { Label } from 'react-aria-components';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components';
import { TagOutlined } from '~/v4/icons/TagOutlined';
import ChevronRight from '~/v4/icons/ChevronRight';
import styles from './TagProductsButton.module.css';
import { clsx } from 'clsx';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

interface TagProductsButtonProps {
  productTagCount: number;
  isPending?: boolean;
  onPress?: () => void;
  className?: string;
}

export const TagProductsButton: React.FC<TagProductsButtonProps> = ({
  productTagCount,
  isPending = false,
  onPress,
  className,
}) => {
  const { isDesktop } = useResponsive();

  return (
    <Button
      variant="default"
      className={clsx(styles.tagProductsButton, className)}
      onPress={onPress}
      isDisabled={isPending}
    >
      <div className={styles.tagProductsButton__left}>
        <div className={styles.tagProductsButton__iconBorder}>
          <TagOutlined className={styles.tagProductsButton__icon} />
        </div>
        <Label>
          {isDesktop ? (
            <Typography.TitleBold className={styles.tagProductsButton__text}>
              {useString('amity_social_button_tag_products')}
            </Typography.TitleBold>
          ) : (
            <Typography.Body className={styles.tagProductsButton__text}>
              {useString('amity_social_button_tag_products')}
            </Typography.Body>
          )}
        </Label>
      </div>
      <div className={styles.tagProductsButton__right}>
        <div className={styles.tagProductsButton__count}>
          <Typography.Caption className={styles.tagProductsButton__countText}>
            {productTagCount ?? 0}
          </Typography.Caption>
        </div>
        <ChevronRight className={styles.tagProductsButton__chevron} />
      </div>
    </Button>
  );
};
