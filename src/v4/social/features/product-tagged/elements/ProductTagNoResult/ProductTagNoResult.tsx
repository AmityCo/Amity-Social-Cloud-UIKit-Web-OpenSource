import React from 'react';
import styles from './ProductTagNoResult.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { PAGE_ID, COMPONENT_ID, ELEMENT_ID } from '~/v4/constants/customization';
import { NoResultFound } from '~/v4/social/internal-components/NoResultFound';

export interface ProductTagNoResultProps {
  pageId?: string;
  componentId?: string;
  icon?: React.ReactElement;
  variant?: 'body' | 'bodyBold';
  iconSize?: 'small' | 'medium';
}

export function ProductTagNoResult({
  pageId = PAGE_ID.WILD_CARD,
  componentId = COMPONENT_ID.WILD_CARD,
  icon,
  variant,
  iconSize,
}: ProductTagNoResultProps) {
  const elementId = ELEMENT_ID.PRODUCT_TAG_NO_RESULT;
  const { config, themeStyles, accessibilityId, isExcluded, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <div className={styles.productTagNoResult} style={themeStyles} data-test-id={accessibilityId}>
      <NoResultFound
        text={resolveText('amity_social_label_no_results_found')}
        icon={icon}
        variant={variant}
        iconSize={iconSize}
      />
    </div>
  );
}
