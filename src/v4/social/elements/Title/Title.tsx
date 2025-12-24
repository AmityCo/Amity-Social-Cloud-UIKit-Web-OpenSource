import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './Title.module.css';

type TitleProps = {
  pageId?: string;
  componentId?: string;
  titleClassName?: string;
  variant?: 'headline' | 'title';
  children?: React.ReactNode;
};

export function Title({
  pageId = '*',
  titleClassName,
  componentId = '*',
  variant = 'title',
  children,
}: TitleProps) {
  const elementId = 'title';
  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const Component = variant === 'headline' ? Typography.Headline : Typography.TitleBold;

  if (isExcluded) return null;

  return (
    <Component
      style={themeStyles}
      data-testid={accessibilityId}
      className={clsx(styles.title, titleClassName)}
    >
      {children ?? config.text}
    </Component>
  );
}
