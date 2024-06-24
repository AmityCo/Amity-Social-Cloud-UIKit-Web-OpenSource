import React from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import styles from './CreatePostButton.module.css';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import clsx from 'clsx';

const CreatePostButtonSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="21" height="20" viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M14.0625 12.7812L15.0625 11.7812C15.2188 11.625 15.5 11.75 15.5 11.9688V16.5C15.5 17.3438 14.8125 18 14 18H3C2.15625 18 1.5 17.3438 1.5 16.5V5.5C1.5 4.6875 2.15625 4 3 4H11.5312C11.75 4 11.875 4.28125 11.7188 4.4375L10.7188 5.4375C10.6562 5.5 10.5938 5.5 10.5312 5.5H3V16.5H14V12.9688C14 12.9062 14 12.8438 14.0625 12.7812ZM18.9375 6.5L10.75 14.6875L7.90625 15C7.09375 15.0938 6.40625 14.4062 6.5 13.5938L6.8125 10.75L15 2.5625C15.7188 1.84375 16.875 1.84375 17.5938 2.5625L18.9375 3.90625C19.6562 4.625 19.6562 5.78125 18.9375 6.5ZM15.875 7.4375L14.0625 5.625L8.25 11.4375L8 13.5L10.0625 13.25L15.875 7.4375ZM17.875 4.96875L16.5312 3.625C16.4062 3.46875 16.1875 3.46875 16.0625 3.625L15.125 4.5625L16.9375 6.40625L17.9062 5.4375C18.0312 5.28125 18.0312 5.09375 17.875 4.96875Z" />
  </svg>
);

interface CreatePostButtonProps {
  pageId?: string;
  componentId: string;
  onClick?: (e: React.MouseEvent) => void;
  defaultClassName?: string;
}

export function CreatePostButton({
  pageId = '*',
  componentId = '*',
  onClick,
  defaultClassName,
}: CreatePostButtonProps) {
  const elementId = 'create_post_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });
  const { AmityCreatePostMenuComponentBehavior } = usePageBehavior();

  if (isExcluded) return null;

  return (
    <button
      className={styles.createPostButton}
      onClick={() => AmityCreatePostMenuComponentBehavior.goToSelectPostTargetPage()}
      data-qa-anchor={accessibilityId}
      style={themeStyles}
    >
      <IconComponent
        defaultIcon={() => (
          <CreatePostButtonSvg className={clsx(styles.createPostButton__icon, defaultClassName)} />
        )}
        imgIcon={() => <img src={config.image} alt={uiReference} />}
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
      />
      <Typography.Body className={styles.createPostButton__text}>{config.text}</Typography.Body>
    </button>
  );
}

export default CreatePostButton;
