import React, { useRef, useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import FallbackReaction from '~/v4/icons/FallbackReaction';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useReactionHandler } from '~/v4/core/hooks/useReactionHandler';
import { ReactionPicker } from '~/v4/social/elements/';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Button } from '~/v4/core/components/AriaButton';
import styles from './ReactionButton.module.css';
import millify from 'millify';
import useSDK from '~/v4/core/hooks/useSDK';
import useUserProfileGlobalBehavior from '~/v4/core/hooks/useUserProfileGlobalBehavior';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';

const LoveSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.5 14.7L7.665 13.94C4.62 11.18 2.6 9.345 2.6 7.105C2.6 5.27 4.04 3.83 5.875 3.83C6.91 3.83 7.905 4.315 8.5 5.077C9.095 4.315 10.09 3.83 11.125 3.83C12.96 3.83 14.4 5.27 14.4 7.105C14.4 9.345 12.38 11.18 9.335 13.945L8.5 14.7Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
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
    <LoveSvg
      className={clsx(styles.reactButton__icon, defaultIconClassName)}
      data-has-my-reaction="false"
    />
  );

  const renderReactionCountText = () => {
    if (isLivestreamReaction) return null;

    let text: string = '';
    let elementId: string = '';

    if (isCommentReaction) {
      text = displayReaction ?? config.text ?? 'Love';
      elementId = 'comment-reaction-text';
    } else if (isClipReaction) {
      text =
        typeof reactionsCount === 'number'
          ? millify(reactionsCount)
          : (myReaction || config.text) ?? '';
      elementId = 'clip-reaction-text';
    } else {
      text = (displayReaction || config.text) ?? '';
      elementId = 'reaction-text';
    }

    const TypographyComponent = isCommentReaction ? Typography.CaptionBold : Typography.BodyBold;

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
        {!isCommentReaction && (
          <>
            {displayReaction ? (
              renderMyReaction()
            ) : (
              <IconComponent
                defaultIcon={defaultIcon ?? renderDefaultIcon}
                imgIcon={() => (
                  <img src={config.icon} alt={uiReference} className={imgIconClassName} />
                )}
                defaultIconName={defaultConfig.icon}
                configIconName={config.icon}
              />
            )}
          </>
        )}
        {renderReactionCountText()}
        {showReactionPicker && !shouldNotShowReactionPicker && (
          <div
            data-testid={`${pageId}/${componentId}/reaction-picker-panel`}
            className={clsx(
              styles.reactButton__panel,
              showPanelBelow && styles.reactButton__panel__below,
            )}
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
