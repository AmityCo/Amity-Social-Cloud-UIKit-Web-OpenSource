import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { AmityLiveViewerCountMode } from '@amityco/ts-sdk';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import LiveDot from '~/v4/icons/LiveDot';
import UserOutlined from '~/v4/icons/UserOutlined';
import { useLiveViewerCountConfig } from './useLiveViewerCountConfig';
import styles from './LiveViewerCount.module.css';

export type LiveViewerCountProps = {
  /** Latest viewer count for the stream. */
  count?: number;
  /**
   * True when the current user is the host or a co-host of the stream.
   * These roles are exempt from mode-based hiding (REQ-002).
   */
  isHostOrCoHost?: boolean;
  /** Renders the LIVE dot before the count for viewer surfaces. */
  isWatcher?: boolean;
  /** Optional className passthrough to the pill. */
  className?: string;
  /** Fires whenever the count-visibility flips. Not fired on initial mount. */
  onVisibilityChanged?: (isCountVisible: boolean) => void;
};

const asString = (v: unknown): string | undefined =>
  typeof v === 'string' && v !== '' ? v : undefined;

function formatCount(count: number): string {
  if (count < 1000) return count.toString();

  if (count < 1000000) {
    const thousands = count / 1000;
    const floored = Math.floor(thousands * 10) / 10;
    if (floored % 1 === 0) return `${Math.floor(floored)}K`;
    return `${floored.toFixed(1)}K`;
  }

  const millions = count / 1000000;
  const floored = Math.floor(millions * 10) / 10;
  if (floored % 1 === 0) return `${Math.floor(floored)}M`;
  return `${floored.toFixed(1)}M`;
}

/**
 * REQ-001 → REQ-007: Compute whether the numeric viewer count should be shown.
 * When `false`, the pill still renders in LIVE-only mode (no count).
 * REQ-003 lifecycle gating is inherited from the caller.
 */
function computeIsCountVisible({
  isHostOrCoHost,
  mode,
  count,
  threshold,
}: {
  isHostOrCoHost: boolean;
  mode: AmityLiveViewerCountMode;
  count: number;
  threshold: number;
}): boolean {
  if (isHostOrCoHost) return true;
  switch (mode) {
    case AmityLiveViewerCountMode.ALWAYS_SHOW:
      return true;
    case AmityLiveViewerCountMode.HIDE_ENTIRELY:
      return false;
    case AmityLiveViewerCountMode.SHOW_ABOVE_MINIMUM:
      return count >= threshold;
    default:
      return true;
  }
}

export function LiveViewerCount({
  count = 0,
  isHostOrCoHost = false,
  isWatcher,
  className,
  onVisibilityChanged,
}: LiveViewerCountProps) {
  const { config, isLoading } = useLiveViewerCountConfig();
  const { config: elementConfig } = useAmityElement({
    pageId: 'livestream_player_page',
    componentId: '*',
    elementId: 'live_viewer_count_element',
  });
  const liveLabel = useString('amity_social_status_live');
  const [iconBroken, setIconBroken] = useState(false);

  const isCountVisible = config
    ? computeIsCountVisible({
        isHostOrCoHost,
        mode: config.mode,
        count,
        threshold: config.threshold,
      })
    : false;

  // REQ-014 (Callbacks): fire on every flip AFTER initial mount.
  const initialisedRef = useRef(false);
  const lastReportedRef = useRef<boolean | null>(null);
  useEffect(() => {
    if (isLoading) return;
    if (!initialisedRef.current) {
      initialisedRef.current = true;
      lastReportedRef.current = isCountVisible;
      return;
    }
    if (lastReportedRef.current !== isCountVisible) {
      lastReportedRef.current = isCountVisible;
      onVisibilityChanged?.(isCountVisible);
    }
  }, [isCountVisible, isLoading, onVisibilityChanged]);

  // REQ-013: never flicker during the cold-read; render nothing until resolved.
  if (isLoading || !config) return null;

  const backgroundColor = asString(elementConfig.background_color);
  const textColor = asString(elementConfig.text_color);
  const iconSrc = asString(elementConfig.icon);
  const showCustomIcon = !!iconSrc && !iconBroken;

  const pillStyle: React.CSSProperties = {
    ...(backgroundColor ? { background: backgroundColor } : {}),
    ...(textColor ? { color: textColor } : {}),
  };

  return (
    <div className={clsx(styles.liveViewerCount, className)} style={pillStyle}>
      {isCountVisible ? (
        <>
          {isWatcher && <LiveDot className={styles.liveViewerCount__liveDotIcon} />}
          {showCustomIcon ? (
            <img
              src={iconSrc}
              alt=""
              className={styles.liveViewerCount__userIcon}
              onError={() => setIconBroken(true)}
            />
          ) : (
            <UserOutlined className={styles.liveViewerCount__userIcon} />
          )}
          <Typography.CaptionBold className={styles.liveViewerCount__text}>
            {formatCount(count)}
          </Typography.CaptionBold>
        </>
      ) : (
        <>
          <LiveDot className={styles.liveViewerCount__liveDotIcon} />
          <Typography.CaptionBold className={styles.liveViewerCount__text}>
            {liveLabel}
          </Typography.CaptionBold>
        </>
      )}
    </div>
  );
}
