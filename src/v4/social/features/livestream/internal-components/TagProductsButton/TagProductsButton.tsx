import React from 'react';
import { resolveString } from '~/v4/core/localization';
import { Label } from 'react-aria-components';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components';
import { TagOutlined } from '~/v4/icons/TagOutlined';
import ChevronRight from '~/v4/icons/ChevronRight';
import styles from './TagProductsButton.module.css';
import { clsx } from 'clsx';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ELEMENT_ID } from '~/v4/constants/customization';

interface TagProductsButtonProps {
  productTagCount: number;
  isPending?: boolean;
  onPress?: () => void;
  className?: string;
  pageId?: string;
}

export const TagProductsButton: React.FC<TagProductsButtonProps> = ({
  productTagCount,
  isPending = false,
  onPress,
  className,
  pageId,
}) => {
  const { isDesktop } = useResponsive();

  // Gated here rather than at the call sites: this is the way into product
  // tagging from livestream setup, from the stream header and from the player,
  // and three guards would have been three chances to forget one — the same
  // reason ProductTagButton gates itself.
  //
  // It used to render on `productCatalogueSettings.product.enabled` alone,
  // which answers whether the network *has* a product catalogue, not whether
  // this customer bought the module. A build with Product switched off still
  // offered the button and still opened the selection sheet behind it. Nothing
  // failed and nothing showed, because the button carried no id at all: a
  // check written against its id passed by being blind to it.
  const { accessibilityId, isExcluded } = useAmityElement({
    pageId: pageId ?? '*',
    componentId: '*',
    elementId: ELEMENT_ID.PRODUCT_TAGGING_BUTTON,
  });

  if (isExcluded) return null;

  // `resolveString`, not `useString`. The label was read twice inside the JSX,
  // which put both reads below the early return — and `useString` is a hook,
  // so switching this module off stopped one from running: React #300 rather
  // than a hidden button. Resolving it as a plain call cannot break that rule
  // however this component is rearranged later, where a hoisted hook only
  // holds while someone remembers why it is hoisted. The cost is that this
  // label alone does not re-render on a locale change until its parent does.
  const label = resolveString('amity_social_button_tag_products');

  return (
    <Button
      variant="default"
      // Named so the absence is provable. Without it the only handle on this
      // button was its visible label.
      data-testid={accessibilityId}
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
              {label}
            </Typography.TitleBold>
          ) : (
            <Typography.Body className={styles.tagProductsButton__text}>{label}</Typography.Body>
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
