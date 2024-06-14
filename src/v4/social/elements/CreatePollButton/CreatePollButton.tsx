import React from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import styles from './CreatePollButton.module.css';
import clsx from 'clsx';

const CreatePollButtonSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M14.6875 0.375C15.6016 0.375 16.375 1.14844 16.375 2.0625V14.4375C16.375 15.3867 15.6016 16.125 14.6875 16.125H2.3125C1.36328 16.125 0.625 15.3867 0.625 14.4375V2.0625C0.625 1.14844 1.36328 0.375 2.3125 0.375H14.6875ZM14.6875 14.4375V2.0625H2.3125V14.4375H14.6875ZM4.84375 12.75C4.52734 12.75 4.28125 12.5039 4.28125 12.1875V7.6875C4.28125 7.40625 4.52734 7.125 4.84375 7.125H5.40625C5.6875 7.125 5.96875 7.40625 5.96875 7.6875V12.1875C5.96875 12.5039 5.6875 12.75 5.40625 12.75H4.84375ZM8.21875 12.75C7.90234 12.75 7.65625 12.5039 7.65625 12.1875V4.3125C7.65625 4.03125 7.90234 3.75 8.21875 3.75H8.78125C9.0625 3.75 9.34375 4.03125 9.34375 4.3125V12.1875C9.34375 12.5039 9.0625 12.75 8.78125 12.75H8.21875ZM11.5938 12.75C11.2773 12.75 11.0312 12.5039 11.0312 12.1875V9.9375C11.0312 9.65625 11.2773 9.375 11.5938 9.375H12.1562C12.4375 9.375 12.7188 9.65625 12.7188 9.9375V12.1875C12.7188 12.5039 12.4375 12.75 12.1562 12.75H11.5938Z" />
  </svg>
);

interface CreatePollButtonProps {
  pageId?: string;
  componentId: string;
  onClick?: (e: React.MouseEvent) => void;
  defaultClassName?: string;
}

export function CreatePollButton({
  pageId = '*',
  componentId = '*',
  onClick,
  defaultClassName,
}: CreatePollButtonProps) {
  const elementId = 'create_poll_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;
  return (
    <div
      className={styles.createPollButton}
      onClick={() => {}} //TODO : Add event create poll
      data-qa-anchor={accessibilityId}
      style={themeStyles}
    >
      <IconComponent
        defaultIcon={() => (
          <CreatePollButtonSvg className={clsx(styles.createPollButton__icon, defaultClassName)} />
        )}
        imgIcon={() => <img src={config.image} alt={uiReference} />}
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
      />
      <Typography.Body className={styles.createPollButton__text}>{config.text}</Typography.Body>
    </div>
  );
}

export default CreatePollButton;
