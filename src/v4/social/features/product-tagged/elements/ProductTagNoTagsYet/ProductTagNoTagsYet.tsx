import React from 'react';
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

  if (isExcluded) return null;

  return (
    <div data-testid={accessibilityId} className={styles.productTagNoTagsYet} style={themeStyles}>
      <TagOutlined className={styles.productTagNoTagsYet__icon} />
      <Typography.TitleBold as="p" className={styles.productTagNoTagsYet__text}>
        No products tagged yet
      </Typography.TitleBold>
      <Typography.Body as="p" className={styles.productTagNoTagsYet__text}>
        You can add or remove products anytime and pin them to control what viewers see while you’re
        live.
      </Typography.Body>
      <Button variant="default" onPress={onPress} className={styles.productTagNoTagsYet__button}>
        <Typography.CaptionBold as="span">Add products</Typography.CaptionBold>
      </Button>
    </div>
  );
}
