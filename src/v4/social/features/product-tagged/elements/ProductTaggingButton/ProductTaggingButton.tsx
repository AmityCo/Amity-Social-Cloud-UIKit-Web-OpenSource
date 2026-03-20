import React from 'react';
import { ButtonProps } from 'react-aria-components';
import { ActionButton } from '~/v4/core/components/ActionButton/ActionButton';
import { TagOutlined } from '~/v4/icons/TagOutlined';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { PAGE_ID, COMPONENT_ID, ELEMENT_ID } from '~/v4/constants/customization';
import styles from './ProductTaggingButton.module.css';

export interface ProductTaggingButtonProps {
  pageId?: string;
  componentId?: string;
  isDisabled?: boolean;
  className?: string;
  onPress?: ButtonProps['onPress'];
  badgeCount?: number;
  'aria-label'?: string;
}

export function ProductTaggingButton({
  pageId = PAGE_ID.WILD_CARD,
  componentId = COMPONENT_ID.WILD_CARD,
  isDisabled,
  className,
  onPress,
  badgeCount,
  'aria-label': ariaLabel,
}: ProductTaggingButtonProps) {
  const elementId = ELEMENT_ID.PRODUCT_TAGGING_BUTTON;
  const { isExcluded } = useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;

  return (
    <>
      <ActionButton
        pageId={pageId}
        componentId={componentId}
        elementId={elementId}
        size="large"
        defaultIcon={<TagOutlined />}
        isDisabled={isDisabled}
        color="secondary"
        className={className}
        onPress={onPress}
        aria-label={ariaLabel ?? elementId}
      />
      {badgeCount != null && badgeCount > 0 && (
        <div aria-hidden="true" className={styles.productTaggingButton__badge}>
          {badgeCount}
        </div>
      )}
    </>
  );
}
