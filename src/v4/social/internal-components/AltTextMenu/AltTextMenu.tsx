import React from 'react';
import Pencil from '~/v4/icons/Pencil';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { CloseButton } from '~/v4/social/elements';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { AltTextConfig } from '~/v4/social/components/AltTextConfig';
import styles from './AltTextMenu.module.css';

type AltTextMenuProps = {
  pageId: string;
  onPress: () => void;
  file?: Amity.File<'image'>;
};

export function AltTextMenu({ pageId = '*', onPress, file }: AltTextMenuProps) {
  const componentId = 'alt_text_menu';
  const { openPopup } = usePopupContext();

  return (
    <div className={styles.altTextMenu}>
      <Button
        aria-haspopup="menu"
        className={styles.altTextMenu__editAltText}
        data-testid={`${pageId}/${componentId}/edit_alt_text_button`}
        onPress={() => {
          onPress();
          if (file)
            openPopup({
              children: ({ close }) => {
                return (
                  <AltTextConfig
                    result={() => close()}
                    mode={{
                      type: 'edit',
                      altText: file.altText || '',
                      media: { type: 'image', image: file },
                    }}
                    renderHeader={({ count }) => (
                      <div className={styles.altTextConfig__header}>
                        <div>
                          <Typography.Headline>Edit alt text</Typography.Headline>
                          <Typography.Caption
                            aria-live="polite"
                            className={styles.altTextConfig__header__count}
                          >
                            {count}/180
                          </Typography.Caption>
                        </div>
                        <CloseButton
                          pageId={pageId}
                          onPress={close}
                          defaultClassName={styles.altTextConfig__header__icon}
                        />
                      </div>
                    )}
                  />
                );
              },
            });
        }}
      >
        <Pencil className={styles.altTextMenu__editAltText__icon} />
        <Typography.BodyBold>Edit alt text</Typography.BodyBold>
      </Button>
    </div>
  );
}
