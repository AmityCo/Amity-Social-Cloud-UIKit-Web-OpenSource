import React from 'react';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components';
import { TagFilled } from '~/v4/icons/TagFilled';
import styles from './TaggedProductIcon.module.css';
import clsx from 'clsx';

type TaggedProductIconProps = {
  productTagAmount: number;
  onPress?: () => void;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
};

export const TaggedProductIcon = ({
  productTagAmount,
  onPress,
  className,
  iconClassName,
  textClassName,
}: TaggedProductIconProps) => {
  return (
    <Button
      variant="default"
      className={clsx(styles.taggedProductIcon__productTagButton, className)}
      onPress={onPress}
    >
      <TagFilled
        className={clsx(styles.taggedProductIcon__productTagButton__icon, iconClassName)}
      />
      {productTagAmount > 0 && (
        <Typography.CaptionBold
          className={clsx(styles.taggedProductIcon__productTagButton__text, textClassName)}
        >
          {productTagAmount}
        </Typography.CaptionBold>
      )}
    </Button>
  );
};
