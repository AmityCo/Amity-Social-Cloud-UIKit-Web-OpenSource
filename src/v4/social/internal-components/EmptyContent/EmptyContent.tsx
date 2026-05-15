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
  textKey?: string;
  infoTextKey?: string;
  emptyContentClassName?: string;
  defaultIcon: () => JSX.Element;
  variant?: 'container' | 'item';
}

export const EmptyContent: React.FC<EmptyContentProps> = ({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  infoElementId = '*',
  text,
  textKey,
  infoTextKey,
  emptyContentClassName,
  variant = 'container',
  defaultIcon,
}) => {
  const {
    config,
    defaultConfig,
    isExcluded,
    themeStyles,
    accessibilityId,
    uiReference,
    resolveText,
  } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const { config: infoConfig, resolveText: resolveInfoText } = useAmityElement({
    pageId,
    componentId,
    elementId: infoElementId,
  });

  if (isExcluded) return null;

  const titleText = textKey ? resolveText(textKey) : config.text ?? text;
  const infoText = infoTextKey ? resolveInfoText(infoTextKey) : infoConfig.text;

  return (
    <div
      style={themeStyles}
      data-variant={variant}
      data-testid={accessibilityId}
      className={clsx(styles.emptyContent, emptyContentClassName)}
    >
      <IconComponent
        defaultIcon={defaultIcon}
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
        imgIcon={() => <img src={config.image} alt={uiReference} />}
      />

      {titleText ? (
        <>
          <Typography.TitleBold className={styles.emptyContent__text}>
            {titleText}
          </Typography.TitleBold>
          {infoText && (
            <Typography.Caption className={styles.emptyContent__text}>
              {infoText}
            </Typography.Caption>
          )}
        </>
      ) : null}
    </div>
  );
};
