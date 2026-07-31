import { useString } from '~/v4/core/localization';
import { Badge } from '~/v4/core/design/atoms/Badge';
import { ShieldCheck } from '~/v4/core/design/icons/ShieldCheck';

export type ModeratorBadgeProps = {
  className?: string;
};

export function ModeratorBadge({ className }: ModeratorBadgeProps) {
  const label = useString('amity_common_button_moderator');

  return (
    <Badge.Icon
      border
      className={className}
      icon={<ShieldCheck.Solid role="img" aria-label={label} />}
      preset={{ family: 'userstatus', case: 'moderator' }}
      size={16}
    />
  );
}
