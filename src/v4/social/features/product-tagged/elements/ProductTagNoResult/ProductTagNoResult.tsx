import React from 'react';
import { Typography } from '~/v4/core/components';
import { NoResultIcon } from '~/v4/icons/NoResult';
import styles from './ProductTagNoResult.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { PAGE_ID, COMPONENT_ID, ELEMENT_ID } from '~/v4/constants/customization';

export interface ProductTagNoResultProps {
  pageId?: string;
  componentId?: string;
}

export function ProductTagNoResult({
  pageId = PAGE_ID.WILD_CARD,
  componentId = COMPONENT_ID.WILD_CARD,
}: ProductTagNoResultProps) {
  const elementId = ELEMENT_ID.PRODUCT_TAG_NO_RESULT;
  const { config, themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <div className={styles.productTagNoResult} style={themeStyles} data-test-id={accessibilityId}>
      <NoResultIcon className={styles.productTagNoResult__icon} />
      <Typography.BodyBold as="p" className={styles.productTagNoResult__text}>
        {config.text ?? 'No results found'}
      </Typography.BodyBold>
    </div>
  );
}
