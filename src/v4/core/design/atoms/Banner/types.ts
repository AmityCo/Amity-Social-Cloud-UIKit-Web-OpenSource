import type { ReactNode } from 'react';

export type BannerHierarchy = 'default' | 'subdue';

export type BannerProps = {
  hierarchy?: BannerHierarchy;
  leadingController?: ReactNode;
  leading?: ReactNode;
  overline?: string;
  header?: ReactNode;
  headerLeadingBadge?: ReactNode;
  headerTrailingBadge?: ReactNode;
  subhead?: ReactNode;
  description?: ReactNode;
  descriptionIcon?: ReactNode;
  trailing?: ReactNode[];
  centered?: boolean;
  loading?: boolean;
  onPress?: () => void;
  onPressLabel?: string;
  className?: string;
};
