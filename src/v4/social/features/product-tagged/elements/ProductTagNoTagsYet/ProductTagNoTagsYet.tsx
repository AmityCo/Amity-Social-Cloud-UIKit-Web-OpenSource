import React from 'react';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import { TagOutlined } from '~/v4/icons/TagOutlined';
import styles from './ProductTagNoTagsYet.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { PAGE_ID, COMPONENT_ID, ELEMENT_ID } from '~/v4/constants/customization';
import { Button } from '~/v4/core/components/AriaButton';

export interface ProductTagNoTagsYetProps {
  pageId?: string;
  componentId?: string;
  onPress: () => void;
}

export function ProductTagNoTagsYet({
  pageId = PAGE_ID.WILD_CARD,
  componentId = COMPONENT_ID.WILD_CARD,
  onPress,
}: ProductTagNoTagsYetProps) {
  const elementId = ELEMENT_ID.PRODUCT_TAG_NO_TAGS_YET;
  const { themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const title = useString('amity_social_empty_state_tagged_products_empty_title');
  const description = useString('amity_social_empty_state_tagged_products_empty_desc');
  const addProductsLabel = useString('amity_social_button_add_products');

  if (isExcluded) return null;

  return (
    <div data-testid={accessibilityId} className={styles.productTagNoTagsYet} style={themeStyles}>
      <TagOutlined className={styles.productTagNoTagsYet__icon} />
      <Typography.TitleBold as="p" className={styles.productTagNoTagsYet__text}>
        {title}
      </Typography.TitleBold>
      <Typography.Body as="p" className={styles.productTagNoTagsYet__text}>
        {description}
      </Typography.Body>
      <Button variant="default" onPress={onPress} className={styles.productTagNoTagsYet__button}>
        <Typography.CaptionBold as="span">{addProductsLabel}</Typography.CaptionBold>
      </Button>
    </div>
  );
}
