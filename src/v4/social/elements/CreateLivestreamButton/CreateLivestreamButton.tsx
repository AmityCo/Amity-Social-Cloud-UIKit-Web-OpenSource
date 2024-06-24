import React from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import styles from './CreateLivestreamButton.module.css';
import clsx from 'clsx';

const CreateLivestreamButtonSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M6.91406 6.80469C7.01953 6.875 7.08984 7.05078 7.08984 7.19141C7.08984 7.29688 7.05469 7.4375 6.98438 7.50781C6.42188 8.17578 6 9.40625 6 10.25C6 11.1289 6.42188 12.3594 6.98438 13.0273C7.05469 13.0977 7.08984 13.2383 7.08984 13.3438C7.08984 13.4844 7.01953 13.6602 6.91406 13.7305L6.52734 14.1172C6.42188 14.2227 6.24609 14.293 6.14062 14.293C5.96484 14.293 5.78906 14.1875 5.68359 14.082C4.91016 13.168 4.27734 11.4453 4.27734 10.25C4.27734 9.08984 4.91016 7.36719 5.68359 6.45312C5.78906 6.34766 5.96484 6.24219 6.14062 6.24219C6.24609 6.24219 6.42188 6.3125 6.52734 6.41797L6.91406 6.80469ZM4.13672 4.0625C4.34766 4.27344 4.34766 4.58984 4.13672 4.83594C2.97656 6.10156 2.0625 8.5625 2.0625 10.2852C2.0625 12.0078 2.97656 14.4336 4.13672 15.6992C4.34766 15.9453 4.34766 16.2617 4.13672 16.4727L3.75 16.8594C3.64453 16.9648 3.46875 17.0352 3.32812 17.0352C3.1875 17.0352 3.01172 16.9297 2.90625 16.8242C1.25391 14.9961 0.375 12.7109 0.375 10.25C0.375 7.82422 1.25391 5.50391 2.90625 3.71094C3.01172 3.60547 3.1875 3.53516 3.32812 3.53516C3.46875 3.53516 3.64453 3.60547 3.75 3.67578L4.13672 4.0625ZM18.0586 3.71094C19.7109 5.50391 20.625 7.82422 20.625 10.25C20.625 12.7109 19.7109 14.9961 18.0586 16.8242C17.9531 16.9297 17.7773 17 17.6367 17C17.4961 17 17.3203 16.9297 17.25 16.8594L16.8281 16.4727C16.6172 16.2617 16.6172 15.9453 16.8281 15.6992C17.9883 14.4336 18.9023 12.0078 18.9023 10.2852C18.9023 8.52734 17.9883 6.10156 16.8281 4.83594C16.6172 4.58984 16.6172 4.27344 16.8281 4.0625L17.25 3.67578C17.3203 3.57031 17.4961 3.5 17.6367 3.5C17.7773 3.5 17.9531 3.60547 18.0586 3.71094ZM10.5 8.28125C11.5547 8.28125 12.4688 9.19531 12.4688 10.25C12.4688 11.3398 11.5547 12.2188 10.5 12.2188C9.41016 12.2188 8.53125 11.3398 8.53125 10.25C8.53125 9.19531 9.41016 8.28125 10.5 8.28125ZM14.4375 6.41797C14.543 6.3125 14.7188 6.24219 14.8242 6.24219C15 6.24219 15.1758 6.34766 15.2812 6.45312C16.0547 7.36719 16.6875 9.08984 16.6875 10.25C16.6875 11.4453 16.0547 13.168 15.2812 14.082C15.1758 14.1875 15 14.293 14.8242 14.293C14.7188 14.293 14.543 14.2227 14.4375 14.1172L14.0508 13.7305C13.9453 13.6602 13.875 13.4844 13.875 13.3438C13.875 13.2383 13.9102 13.0977 13.9805 13.0273C14.543 12.3594 14.9648 11.1289 14.9648 10.25C14.9648 9.40625 14.543 8.17578 13.9805 7.50781C13.9102 7.4375 13.875 7.29688 13.875 7.19141C13.875 7.05078 13.9453 6.875 14.0508 6.80469L14.4375 6.41797Z" />
  </svg>
);

interface CreateLivestreamButtonProps {
  pageId?: string;
  componentId: string;
  onClick?: (e: React.MouseEvent) => void;
  defaultClassName?: string;
}

export function CreateLivestreamButton({
  pageId = '*',
  componentId = '*',
  onClick,
  defaultClassName,
}: CreateLivestreamButtonProps) {
  const elementId = 'create_livestream_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;
  return (
    <div
      className={styles.createLivestreamButton}
      onClick={() => {}} //TODO : Add event create livestream
      data-qa-anchor={accessibilityId}
      style={themeStyles}
    >
      <IconComponent
        defaultIcon={() => (
          <CreateLivestreamButtonSvg
            className={clsx(styles.createLivestreamButton__icon, defaultClassName)}
          />
        )}
        imgIcon={() => <img src={config.image} alt={uiReference} />}
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
      />
      <Typography.Body className={styles.createLivestreamButton__text}>
        {config.text}
      </Typography.Body>
    </div>
  );
}

export default CreateLivestreamButton;
