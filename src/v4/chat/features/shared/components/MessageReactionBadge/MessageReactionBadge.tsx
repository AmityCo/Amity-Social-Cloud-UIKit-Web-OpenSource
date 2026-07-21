import { useMemo } from 'react';
import type { ComponentType, SVGProps } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { abbreviateCount } from '~/v4/utils/abbreviateCount';
import { MAX_REACTION_BADGE_ICONS } from '~/v4/chat/constants';
import { REACTION_ICON_MAP } from '~/v4/chat/utils/reactionIcons';
import { FallbackReaction } from '~/v4/core/design/icons/FallbackReaction';
import styles from './MessageReactionBadge.module.css';

type MessageReactionBadgeProps = {
  message: Amity.Message;
  onTap: () => void;
};

export function MessageReactionBadge({ message, onTap }: MessageReactionBadgeProps) {
  const reactionMap = (message.reactions as Record<string, number> | undefined) ?? {};
  const totalCount = message.reactionsCount ?? 0;
  const containsMyReaction = (message.myReactions?.length ?? 0) > 0;

  const sortedNames = useMemo(() => {
    return Object.entries(reactionMap)
      .filter(([, count]) => count > 0)
      .sort((a, b) => (a[1] === b[1] ? a[0].localeCompare(b[0]) : b[1] - a[1]))
      .slice(0, MAX_REACTION_BADGE_ICONS)
      .map(([name]) => name);
  }, [reactionMap]);

  if (totalCount === 0 || message.isDeleted) return null;

  return (
    <AriaButton
      type="button"
      className={styles.messageReactionBadge}
      data-contains-my-reaction={containsMyReaction ? 'true' : 'false'}
      onPress={onTap}
      aria-label={`View ${totalCount} reactions`}
    >
      <span className={styles.messageReactionBadge__stack}>
        {sortedNames.map((name, index) => {
          const Icon: ComponentType<SVGProps<SVGSVGElement>> =
            REACTION_ICON_MAP[name] ?? FallbackReaction;
          return (
            <span
              key={`${name}-${index}`}
              className={styles.messageReactionBadge__icon}
              style={{ zIndex: MAX_REACTION_BADGE_ICONS - index }}
            >
              <Icon className={styles.messageReactionBadge__iconSvg} />
            </span>
          );
        })}
      </span>
      <Typography.CaptionBold className={styles.messageReactionBadge__count}>
        {abbreviateCount(totalCount)}
      </Typography.CaptionBold>
    </AriaButton>
  );
}
