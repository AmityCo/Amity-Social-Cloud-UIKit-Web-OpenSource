import React from 'react';
import styles from './EmptyContent.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import clsx from 'clsx';

interface EmptyContentProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  infoElementId?: string;
  text?: string;
  emptyContentClassName?: string;
  defaultIcon: () => JSX.Element;
}

export const EmptyContent: React.FC<EmptyContentProps> = ({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  infoElementId = '*',
  text,
  emptyContentClassName,
  defaultIcon,
}) => {
  const { config, defaultConfig, isExcluded, themeStyles, accessibilityId, uiReference } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  const { config: infoConfig } = useAmityElement({
    pageId,
    componentId,
    elementId: infoElementId,
  });

  if (isExcluded) return null;

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={clsx(styles.emptyContent, emptyContentClassName)}
    >
      <IconComponent
        defaultIcon={defaultIcon}
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
        imgIcon={() => <img src={config.image} alt={uiReference} />}
      />

      {config.text ? (
        <>
          <Typography.TitleBold className={styles.emptyContent__text}>
            {config.text}
          </Typography.TitleBold>
          {infoConfig.text && (
            <Typography.Caption className={styles.emptyContent__text}>
              {infoConfig.text}
            </Typography.Caption>
          )}
        </>
      ) : text ? (
        <Typography.TitleBold className={styles.emptyContent__text}>{text}</Typography.TitleBold>
      ) : null}
    </div>
  );
};
