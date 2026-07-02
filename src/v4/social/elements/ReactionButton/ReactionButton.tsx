import type React from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import millify from 'millify';

import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';
import { useReactionHandler } from '~/v4/core/hooks/useReactionHandler';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import useSDK from '~/v4/core/hooks/useSDK';
import useUserProfileGlobalBehavior from '~/v4/core/hooks/useUserProfileGlobalBehavior';
import { IconComponent } from '~/v4/core/IconComponent';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import FallbackReaction from '~/v4/icons/FallbackReaction';
import { ReactionPicker } from '~/v4/social/elements/';

import styles from './ReactionButton.module.css';

// Heart "react" icon. Fill is omitted so it inherits the `fill` set by the
// consuming icon class (tertiary for the un-reacted state).
const LikeSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.125 3C3.65582 3 2.5 4.13833 2.5 5.5C2.5 7.69697 3.87479 9.57268 5.34094 10.9394C6.06586 11.6152 6.79284 12.1473 7.3393 12.5105C7.61205 12.6919 7.83858 12.8303 7.99574 12.9227C7.99716 12.9236 7.99858 12.9244 8 12.9253C8.00141 12.9244 8.00284 12.9236 8.00426 12.9227C8.16142 12.8303 8.38795 12.6919 8.6607 12.5105C9.20716 12.1473 9.93414 11.6152 10.6591 10.9394C12.1252 9.57268 13.5 7.69697 13.5 5.5C13.5 4.13833 12.3442 3 10.875 3C9.78016 3 8.85257 3.63635 8.4568 4.52559C8.37649 4.70602 8.1975 4.82228 8 4.82228C7.8025 4.82228 7.62351 4.70602 7.5432 4.52559C7.14743 3.63635 6.21984 3 5.125 3ZM8 13.5C7.76549 13.9416 7.76533 13.9415 7.76515 13.9414L7.76331 13.9404L7.75896 13.9381L7.74386 13.9299C7.731 13.9229 7.71261 13.9128 7.68905 13.8997C7.64195 13.8734 7.57416 13.8349 7.48864 13.7846C7.31767 13.684 7.07545 13.5359 6.7857 13.3433C6.20716 12.9587 5.43414 12.3934 4.65906 11.6709C3.12521 10.241 1.5 8.11673 1.5 5.5C1.5 3.54796 3.1424 2 5.125 2C6.29092 2 7.33488 2.53272 8 3.36773C8.66512 2.53273 9.70908 2 10.875 2C12.8576 2 14.5 3.54796 14.5 5.5C14.5 8.11673 12.8748 10.241 11.3409 11.6709C10.5659 12.3934 9.79284 12.9587 9.2143 13.3433C8.92455 13.5359 8.68233 13.684 8.51136 13.7846C8.42584 13.8349 8.35805 13.8734 8.31095 13.8997C8.2874 13.9128 8.269 13.9229 8.25614 13.9299L8.24104 13.9381L8.23669 13.9404L8.23532 13.9412C8.23514 13.9413 8.23451 13.9416 8 13.5ZM8 13.5L8.23451 13.9416C8.08787 14.0195 7.91179 14.0193 7.76515 13.9414L8 13.5Z"
    />
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
  fallbackReactButtonClassName?: string;
  defaultIcon?: () => JSX.Element;
  onReactionClick: (reactionKey: string) => boolean;
  onHover?: () => void;
  onLongPress?: () => void;
  hoverDuration?: number;
  longPressDuration?: number;
  isLivestreamReaction?: boolean;
  isCommentReaction?: boolean;
  isClipReaction?: boolean;
  referenceType?: 'post' | 'comment';
  community?: Amity.Community | null;
}

const MOUSE_DURATION = 250;
const LONG_PRESS_DURATION = 500;
const PANEL_TOP_THRESHOLD_DESKTOP = 95; // Minimum space from top of page to show panel
const PANEL_TOP_THRESHOLD_MOBILE = 170;
const PANEL_TOP_THRESHOLD_MOBILE_USER_FEED = 215;

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
  fallbackReactButtonClassName,
  hoverDuration = MOUSE_DURATION,
  longPressDuration = LONG_PRESS_DURATION,
  onHover,
  onLongPress,
  defaultIcon,
  onReactionClick,
  isLivestreamReaction = false,
  isCommentReaction = false,
  isClipReaction = false,
  referenceType = 'post',
  community,
}: ReactionButtonProps) {
  const elementId = 'reaction_button';

  const { isExcluded, accessibilityId, config, defaultConfig, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  const { displaySocialReactions } = useCustomReaction();

  const reactionButtonRef = useRef<HTMLButtonElement>(null);
  const desktopButtonRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Horizontal override (relative to the trigger) applied only when the comment
  // reaction picker can't fit on screen anchored to its trigger. null = use CSS default.
  const [panelLeft, setPanelLeft] = useState<number | null>(null);

  const { isVisitorOrBot } = useSDK();
  const shouldNotShowReactionPicker = isVisitorOrBot || (community && !community.isJoined);
  const [showPanelBelow, setShowPanelBelow] = useState(false);

  const { isDesktop } = useResponsive();
  const { page } = useNavigation();

  const {
    showReactionPicker,
    displayReaction,
    hasMyReaction,
    hoveredReaction,
    handleReactionPickerSelect,
    handleMouseEnter,
    handleCustomMouseLeave,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    handleMouseDown,
    handleMouseUp,
    handleQuickReaction,
    handleReactionHover,
    longPressEvent,
    isLongPressing,
  } = useReactionHandler({
    myReaction,
    hoverDuration,
    longPressDuration,
    community,
    onReactionClick,
    onHover,
    onLongPress,
  });

  const checkButtonPosition = useCallback(() => {
    const buttonElement = isDesktop ? desktopButtonRef.current : reactionButtonRef.current;
    if (!buttonElement) return;

    const buttonRect = buttonElement.getBoundingClientRect();

    const threshold = isDesktop
      ? PANEL_TOP_THRESHOLD_DESKTOP
      : page.type === PageTypes.UserProfilePage
        ? PANEL_TOP_THRESHOLD_MOBILE_USER_FEED
        : PANEL_TOP_THRESHOLD_MOBILE;

    const hasSpaceAbove = buttonRect.top >= threshold;

    setShowPanelBelow(!hasSpaceAbove);
  }, [isDesktop]);

  useEffect(() => {
    if (showReactionPicker) {
      checkButtonPosition();
    }
  }, [showReactionPicker, checkButtonPosition]);

  // Comment reactions are anchored to their trigger, which on the narrowest screens
  // pushes the picker off the right edge. When it can't fit from the trigger, center
  // it within the viewport instead. Wider layouts keep the default anchored position.
  const computePanelLeft = useCallback(() => {
    if (isDesktop || referenceType !== 'comment') return null;

    const trigger = reactionButtonRef.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return null;

    const triggerRect = trigger.getBoundingClientRect();
    const panelWidth = panel.offsetWidth;
    const viewportWidth = document.documentElement.clientWidth;
    const margin = 8;

    // Anchored at the trigger the picker runs to roughly triggerRect.left + panelWidth.
    // If that clears the right edge there's enough room, so keep the current position.
    if (triggerRect.left + panelWidth <= viewportWidth - margin) return null;

    // Otherwise center in the viewport (clamped to the margin), expressed relative to
    // the trigger since the panel is absolutely positioned within it.
    const centeredViewportLeft = Math.max(margin, (viewportWidth - panelWidth) / 2);
    return centeredViewportLeft - triggerRect.left;
  }, [isDesktop, referenceType]);

  useLayoutEffect(() => {
    if (!showReactionPicker) {
      setPanelLeft(null);
      return;
    }

    const update = () => setPanelLeft(computePanelLeft());
    update();

    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [showReactionPicker, computePanelLeft]);

  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();
  const { handleUserProfileBehavior } = useUserProfileGlobalBehavior();

  useEffect(() => {
    if (showReactionPicker && shouldNotShowReactionPicker) {
      if (community)
        handleCommunityProfileBehavior({
          isJoined: community.isJoined,
          allowNonMember: false,
        });
      else
        handleUserProfileBehavior({
          allowNonFollower: true,
        });
    }
  }, [showReactionPicker, shouldNotShowReactionPicker]);

  if (isExcluded) return null;

  const renderMyReaction = () => {
    if (!displayReaction) return null;

    const customReaction = displaySocialReactions?.find(
      (reaction) => reaction.name === displayReaction,
    );

    if (customReaction) {
      return (
        <img
          data-testid={`${customReaction.name}-button`}
          src={customReaction.image}
          alt={customReaction.name}
          className={clsx(styles.reactButton__icon, reactButtonClassName)}
        />
      );
    }

    return (
      <FallbackReaction className={clsx(styles.reactButton__icon, fallbackReactButtonClassName)} />
    );
  };

  const renderDefaultIcon = () => (
    <LikeSvg
      className={clsx(styles.reactButton__icon, defaultIconClassName)}
      data-has-my-reaction="false"
    />
  );

  const renderReactionCountText = () => {
    if (isLivestreamReaction) return null;

    let text: string = '';
    let elementId: string = '';

    if (isCommentReaction) {
      text = displayReaction ?? 'React';
      elementId = 'comment-reaction-text';
    } else if (isClipReaction) {
      text =
        typeof reactionsCount === 'number'
          ? millify(reactionsCount)
          : (myReaction || config.text) ?? '';
      elementId = 'clip-reaction-text';
    } else {
      text = displayReaction || 'React';
      elementId = 'reaction-text';
    }

    const TypographyComponent = isCommentReaction ? Typography.CaptionBold : Typography;

    return (
      <TypographyComponent
        className={clsx(styles.reactButton__reactionsText, reactionsCountClassName)}
        data-has-my-reaction={hasMyReaction}
        testId={`${pageId}/${componentId}/${elementId}`}
      >
        {text}
      </TypographyComponent>
    );
  };

  const renderReactionButton = () => {
    return (
      <>
        {displayReaction ? (
          renderMyReaction()
        ) : (
          <IconComponent
            defaultIcon={defaultIcon ?? renderDefaultIcon}
            imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
            defaultIconName={defaultConfig.icon}
            configIconName={config.icon}
          />
        )}
        {renderReactionCountText()}
        {showReactionPicker && !shouldNotShowReactionPicker && (
          <div
            ref={panelRef}
            data-testid={`${pageId}/${componentId}/reaction-picker-panel`}
            className={clsx(
              styles.reactButton__panel,
              showPanelBelow && styles.reactButton__panel__below,
            )}
            style={panelLeft != null ? { left: `${panelLeft}px` } : undefined}
            data-is-clip={isClipReaction}
            data-position={showPanelBelow ? 'below' : 'above'}
            data-reference-type={referenceType}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ReactionPicker
              pageId={pageId}
              componentId={componentId}
              myReaction={displayReaction}
              onReactionClick={handleReactionPickerSelect}
              onReactionHover={handleReactionHover}
              position={showPanelBelow ? 'below' : 'above'}
              hoveredReaction={hoveredReaction}
            />
          </div>
        )}
      </>
    );
  };

  return isDesktop ? (
    <div
      ref={desktopButtonRef}
      style={themeStyles}
      data-testid={accessibilityId}
      className={clsx(styles.reactButton, buttonClassName)}
      onClick={(e) => {
        // Prevent click if reaction picker is shown
        e.stopPropagation();
        if (showReactionPicker) return;
        handleQuickReaction();
      }}
      role="button"
      tabIndex={0}
      aria-label="Reaction Button"
      {...longPressEvent}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleCustomMouseLeave}
    >
      {renderReactionButton()}
    </div>
  ) : (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleCustomMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={styles.reactionButton__wrapper}
      data-is-clip={isClipReaction}
      role="button"
      tabIndex={0}
      aria-label="Reaction Button"
    >
      <Button
        variant="default"
        ref={reactionButtonRef}
        style={themeStyles}
        data-testid={accessibilityId}
        className={clsx(styles.reactButton, buttonClassName)}
        onPress={(e) => {
          if (showReactionPicker || isLongPressing) {
            return;
          }

          handleQuickReaction();
        }}
      >
        {renderReactionButton()}
      </Button>
    </div>
  );
}
