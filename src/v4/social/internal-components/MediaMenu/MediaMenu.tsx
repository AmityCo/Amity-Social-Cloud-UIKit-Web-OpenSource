import React from 'react';
import Pencil from '~/v4/icons/Pencil';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { CloseButton } from '~/v4/social/elements';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { AltTextConfig } from '~/v4/social/components/AltTextConfig';
import styles from './MediaMenu.module.css';
import { Feed } from '~/v4/icons/Feed';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';

type MediaMenuProps = {
  pageId: string;
  componentId?: string;
  onEditAltTextPress?: () => void;
  file?: Amity.File<'image'>;
  onViewPostPress?: () => void;
};

export function MediaMenu({
  file,
  pageId = '*',
  onViewPostPress,
  componentId = '*',
  onEditAltTextPress,
}: MediaMenuProps) {
  const { openPopup } = usePopupContext();

  return (
    <div className={styles.mediaMenu}>
      {onViewPostPress && (
        <Button
          aria-haspopup="menu"
          onPress={onViewPostPress}
          className={styles.mediaMenu__item}
          data-testid={`${pageId}/${componentId}/view_post_button`}
        >
          <Feed className={styles.mediaMenu__item__icon} />
          <Typography.BodyBold>View post</Typography.BodyBold>
        </Button>
      )}
      {onEditAltTextPress && (
        <Button
          aria-haspopup="menu"
          className={styles.mediaMenu__item}
          data-testid={`${pageId}/${componentId}/edit_alt_text_button`}
          onPress={() => {
            onEditAltTextPress();
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
          <Pencil className={styles.mediaMenu__item__icon} />
          <Typography.BodyBold>Edit alt text</Typography.BodyBold>
        </Button>
      )}
    </div>
  );
}
