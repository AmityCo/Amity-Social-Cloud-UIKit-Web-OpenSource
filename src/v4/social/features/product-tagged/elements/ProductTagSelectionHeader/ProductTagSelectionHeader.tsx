import React from 'react';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { CloseButton } from '~/v4/social/elements/CloseButton';
import styles from './ProductTagSelectionHeader.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ProductTagSelectionMode } from '~/v4/social/features/product-tagged/components/ProductTagSelection/ProductTagSelection';
import { PAGE_ID, COMPONENT_ID, ELEMENT_ID } from '~/v4/constants/customization';

export interface ProductTagSelectionHeaderProps {
  mode: ProductTagSelectionMode;
  displayMode?: 'mobile' | 'desktop';
  selectedCount?: number;
  maxCount?: number;
  onClose?: () => void;
  onDone?: () => void;
  pageId?: string;
  componentId?: string;
  isShowNoProductsTagYet?: boolean;
}

export function ProductTagSelectionHeader({
  mode,
  displayMode = 'mobile',
  selectedCount = 0,
  maxCount = 5,
  onClose,
  onDone,
  pageId = PAGE_ID.WILD_CARD,
  componentId = COMPONENT_ID.WILD_CARD,
  isShowNoProductsTagYet = false,
}: ProductTagSelectionHeaderProps) {
  const elementId = ELEMENT_ID.PRODUCT_TAG_SELECTION_HEADER;
  const { themeStyles, accessibilityId, config } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const title =
    mode === 'livestream'
      ? isShowNoProductsTagYet
        ? 'Tagged products'
        : 'Add Products'
      : mode === 'create'
        ? config.create_mode_title || 'Tag products'
        : config.edit_mode_title || 'Edit tags';

  const doneButtonText = config.done_button_text || 'Done';

  const TitleComponent = displayMode === 'mobile' ? Typography.TitleBold : Typography.Headline;

  return (
    <div
      className={styles.productTagSelectionHeader}
      style={themeStyles}
      data-test-id={accessibilityId}
      data-display={displayMode}
    >
      <div data-mode={mode} className={styles.productTagSelectionHeader__content}>
        {mode !== 'livestream' && displayMode === 'mobile' && (
          <CloseButton
            pageId={pageId}
            componentId={componentId}
            className={styles.productTagSelectionHeader__closeButton}
            onPress={onClose}
          />
        )}
        <div className={styles.productTagSelectionHeader__titleSection}>
          <TitleComponent as="h2" className={styles.productTagSelectionHeader__title}>
            {title}
          </TitleComponent>
          <Typography.Caption as="p" className={styles.productTagSelectionHeader__counter}>
            {selectedCount}/{maxCount}
          </Typography.Caption>
        </div>
        {mode !== 'livestream' && displayMode === 'mobile' ? (
          <Button onPress={onDone} variant="text" color="primary">
            {doneButtonText}
          </Button>
        ) : (
          <CloseButton
            pageId={pageId}
            componentId={componentId}
            className={styles.productTagSelectionHeader__closeButton}
            defaultClassName={styles.productTagSelectionHeader__closeIcon}
            onPress={() => {
              mode === 'livestream' ? onClose?.() : onDone?.();
            }}
          />
        )}
      </div>
    </div>
  );
}
