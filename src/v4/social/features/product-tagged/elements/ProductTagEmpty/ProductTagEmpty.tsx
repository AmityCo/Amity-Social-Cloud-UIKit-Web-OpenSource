import React from 'react';
import { Typography } from '~/v4/core/components';
import { Search } from '~/v4/icons/Search';
import styles from './ProductTagEmpty.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { PAGE_ID, COMPONENT_ID, ELEMENT_ID } from '~/v4/constants/customization';

export interface ProductTagEmptyProps {
  pageId?: string;
  componentId?: string;
}

export function ProductTagEmpty({
  pageId = PAGE_ID.WILD_CARD,
  componentId = COMPONENT_ID.WILD_CARD,
}: ProductTagEmptyProps) {
  const elementId = ELEMENT_ID.PRODUCT_TAG_EMPTY;
  const { config, themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <div className={styles.productTagEmpty} style={themeStyles} data-test-id={accessibilityId}>
      <Search className={styles.productTagEmpty__icon} />
      <Typography.BodyBold as="p" className={styles.productTagEmpty__text}>
        {config.text ?? 'Start typing to search for products'}
      </Typography.BodyBold>
    </div>
  );
}
