import React, { useCallback, useRef } from 'react';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import Crying from '~/v4/social/elements/ReactionButton/Crying';
import Fire from '~/v4/social/elements/ReactionButton/Fire';
import Happy from '~/v4/social/elements/ReactionButton/Happy';
import Like from '~/v4/social/elements/ReactionButton/Like';
import Love from '~/v4/social/elements/ReactionButton/Love';
import styles from './ReactionButton.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { Button } from '~/v4/core/natives/Button';
import millify from 'millify';

const LikeSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="17"
    height="18"
    viewBox="0 0 17 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M15.9727 9.6543C16.1055 10.418 16.0059 11.1484 15.6738 11.7461C15.7734 12.543 15.541 13.373 15.0762 13.9707C15.043 15.8301 13.9141 17.125 11.3574 17.125C11.125 17.125 10.8594 17.125 10.5938 17.125C7.20703 17.125 6.17773 15.8633 4.68359 15.8301C4.58398 16.2617 4.15234 16.5938 3.6875 16.5938H1.5625C0.964844 16.5938 0.5 16.1289 0.5 15.5312V7.5625C0.5 6.99805 0.964844 6.5 1.5625 6.5H4.81641C5.44727 5.96875 6.34375 4.50781 7.10742 3.74414C7.57227 3.2793 7.43945 0.125 9.49805 0.125C11.3906 0.125 12.6523 1.1875 12.6523 3.61133C12.6523 4.24219 12.5195 4.74023 12.3535 5.17188H13.582C15.1758 5.17188 16.4375 6.5332 16.4375 7.99414C16.4375 8.625 16.2715 9.15625 15.9727 9.6543ZM13.9141 11.4473C14.6445 10.7832 14.5449 9.75391 14.0801 9.25586C14.4121 9.25586 14.8438 8.625 14.8438 8.02734C14.8105 7.39648 14.2793 6.76562 13.582 6.76562H10.1289C10.1289 5.50391 11.0586 4.90625 11.0586 3.61133C11.0586 2.81445 11.0586 1.71875 9.49805 1.71875C8.86719 2.34961 9.16602 3.94336 8.23633 4.87305C7.33984 5.76953 6.04492 8.09375 5.08203 8.09375H4.75V14.3027C6.50977 14.3027 8.07031 15.5312 10.4277 15.5312H11.6895C12.8516 15.5312 13.7148 14.9668 13.4492 13.373C13.9473 13.0742 14.3457 12.1445 13.9141 11.4473ZM3.42188 14.4688C3.42188 14.0371 3.05664 13.6719 2.625 13.6719C2.16016 13.6719 1.82812 14.0371 1.82812 14.4688C1.82812 14.9336 2.16016 15.2656 2.625 15.2656C3.05664 15.2656 3.42188 14.9336 3.42188 14.4688Z" />
  </svg>
);

interface ReactionButtonProps {
  pageId?: string;
  componentId?: string;
  myReaction?: string | null;
  reactionsCount?: number;
  buttonClassName?: string;
  reactionsCountClassName?: string;
  defaultIconClassName?: string;
  imgIconClassName?: string;
  reactButtonClassName?: string;
  defaultIcon?: () => JSX.Element;
  onReactionClick: (reactionKey: string) => void;
  onHover?: () => void;
  onLongPress?: () => void;
  hoverDuration?: number;
  longPressDuration?: number;
}

const MOUSE_DURATION = 250;
const LONG_PRESS_DURATION = 500;

export function ReactionButton({
  pageId = '*',
  componentId = '*',
  myReaction,
  reactionsCount,
  buttonClassName,
  reactionsCountClassName,
  defaultIconClassName,
  imgIconClassName,
  reactButtonClassName,
  hoverDuration = MOUSE_DURATION,
  longPressDuration = LONG_PRESS_DURATION,
  onHover,
  onLongPress,
  defaultIcon,
  onReactionClick,
}: ReactionButtonProps) {
  const elementId = 'reaction_button';

  const { isExcluded, accessibilityId, config, defaultConfig, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { isDesktop } = useResponsive();

  const handleMouseEnter = useCallback(() => {
    if (!onHover) return;

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      onHover();
    }, hoverDuration);
  }, [hoverDuration, onHover]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const handleTouchStart = useCallback(() => {
    if (!onLongPress || isDesktop) return;

    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }

    longPressTimeoutRef.current = setTimeout(() => {
      onLongPress();
    }, longPressDuration);
  }, [onLongPress, longPressDuration, isDesktop]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  }, []);

  const hasMyReaction = myReaction != null;

  if (isExcluded) return null;

  const renderMyReaction = () => {
    switch (myReaction) {
      case 'like':
        return <Like className={clsx(styles.reactButton__icon, reactButtonClassName)} />;
      case 'love':
        return <Love className={styles.reactButton__icon} />;
      case 'fire':
        return <Fire className={styles.reactButton__icon} />;
      case 'happy':
        return <Happy className={styles.reactButton__icon} />;
      case 'crying':
        return <Crying className={styles.reactButton__icon} />;
      default:
        return null;
    }
  };

  const renderDefaultIcon = () => (
    <LikeSvg
      className={clsx(styles.reactButton__icon, defaultIconClassName)}
      data-has-my-reaction="false"
    />
  );

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <Button
        style={themeStyles}
        data-testid={accessibilityId}
        aria-pressed={hasMyReaction}
        aria-label={`${myReaction ? `Remove ${myReaction} reaction` : 'Add reaction'} ${
          reactionsCount
            ? `(${reactionsCount} ${reactionsCount === 1 ? 'reaction' : 'reactions'})`
            : ''
        }`}
        className={clsx(styles.reactButton, buttonClassName)}
        onPress={() => {
          handleMouseLeave();
          handleTouchEnd();
          onReactionClick('like');
        }}
      >
        {myReaction ? (
          renderMyReaction()
        ) : (
          <IconComponent
            defaultIcon={defaultIcon ?? renderDefaultIcon}
            imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
            defaultIconName={defaultConfig.icon}
            configIconName={config.icon}
          />
        )}
        <Typography.BodyBold
          className={clsx(styles.reactButton__reactionsText, reactionsCountClassName)}
          data-has-my-reaction={hasMyReaction}
        >
          {typeof reactionsCount === 'number' ? millify(reactionsCount) : myReaction || config.text}
        </Typography.BodyBold>
      </Button>
    </div>
  );
}
