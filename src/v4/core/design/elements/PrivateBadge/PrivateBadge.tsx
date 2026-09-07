import { Badge } from '~/v4/core/design/atoms/Badge';
import type { BadgeSize } from '~/v4/core/design/atoms/Badge/types';
import { LockKeyhole } from '~/v4/core/design/icons/LockKeyhole';

export type PrivateBadgeProps = {
  className?: string;
  size?: BadgeSize;
  border?: boolean;
  'data-testid'?: string;
};

export function PrivateBadge({
  className,
  size = 16,
  border = false,
  'data-testid': testId,
}: PrivateBadgeProps) {
  return (
    <Badge.Icon
      className={className}
      data-testid={testId}
      icon={<LockKeyhole.Solid />}
      preset={{ family: 'chat', case: 'private' }}
      size={size}
      border={border}
    />
  );
}
