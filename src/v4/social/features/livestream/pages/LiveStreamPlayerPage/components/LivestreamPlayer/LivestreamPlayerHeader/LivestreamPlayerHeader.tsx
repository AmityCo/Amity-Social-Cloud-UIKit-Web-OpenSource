import React from 'react';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components';
import { IconButton } from '~/v4/core/components/IconButton';
import { Popover } from '~/v4/core/components/AriaPopover';
import { ClearButton } from '~/v4/social/elements/ClearButton';
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar';
import { CopyLinkButton } from '~/v4/social/elements/CopyLinkButton';
import { LiveStreamLiveBadge } from '~/v4/social/features/livestream/internal-components/LiveStreamLiveBadge';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { SharableModel } from '~/v4/utils/sharableLink';
import { useWatchingCount } from '~/v4/social/features/livestream/hooks';
import { WatchingCountBadge } from '~/v4/social/features/livestream/internal-components/WatchingCountBadge';
import CloseIcon from '~/v4/icons/Close';
import Kebub from '~/v4/icons/Kebub';
import styles from './LivestreamPlayerHeader.module.css';

interface LivestreamPlayerHeaderProps {
  pageId: string;
  post: Amity.Post;
  community?: Amity.Community | null;
  isLive: boolean;
  isEnded: boolean;
  isUserBanned: boolean;
  room?: Amity.Room;
  onClose: () => void;
}

export const LivestreamPlayerHeader: React.FC<LivestreamPlayerHeaderProps> = ({
  pageId,
  post,
  community,
  isLive,
  isEnded,
  isUserBanned,
  room,
  onClose,
}) => {
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { isDesktop } = useResponsive();

  const { watchingCount } = useWatchingCount({ roomId: room?.roomId });

  return (
    <div className={styles.livestreamPlayerHeader}>
      {isLive ? (
        <div className={styles.livestreamPlayerHeader__liveDetail} key="live-header">
          <div className={styles.livestreamPlayerHeader__liveDetail__detail}>
            <Button
              variant="text"
              onPress={onClose}
              className={styles.livestreamPlayerHeader__closeButton}
              data-is-live={isLive}
            >
              <CloseIcon
                className={styles.livestreamPlayerHeader__closeButton__icon}
                data-is-live={isLive}
                data-is-ended={isEnded}
              />
            </Button>
            <CommunityAvatar
              pageId={pageId}
              community={community}
              className={styles.livestreamPlayerHeader__liveDetail__avatar}
            />

            <div>
              <Typography.CaptionBold className={styles.livestreamPlayer__liveDetail__text}>
                {community?.displayName}
              </Typography.CaptionBold>
              <Typography.CaptionSmall className={styles.livestreamPlayer__liveDetail__text}>
                By {post.creator?.displayName}
              </Typography.CaptionSmall>
            </div>
          </div>

          <div className={styles.livestreamPlayerHeader__liveDetail__optionWrapper}>
            <WatchingCountBadge count={watchingCount} />
            {community?.isPublic && (
              <Popover
                trigger={({ openPopover }) => (
                  <IconButton
                    variant="text"
                    pageId={pageId}
                    defaultIcon={<Kebub className={styles.livestreamPlayerHeader__optionIcon} />}
                    onPress={() =>
                      isDesktop
                        ? openPopover()
                        : setDrawerData({
                            content: (
                              <CopyLinkButton
                                pageId={pageId}
                                model={SharableModel.POST}
                                referenceId={post.postId}
                                onDone={removeDrawerData}
                              />
                            ),
                          })
                    }
                  />
                )}
              >
                {({ closePopover }) => (
                  <CopyLinkButton
                    pageId={pageId}
                    model={SharableModel.POST}
                    referenceId={post.postId}
                    onDone={isDesktop ? closePopover : removeDrawerData}
                  />
                )}
              </Popover>
            )}
          </div>
        </div>
      ) : (
        <div key="normal-header">
          <ClearButton
            onPress={() => onClose()}
            buttonClassName={styles.livestreamPlayerHeader__closeButton}
            defaultClassName={styles.livestreamPlayerHeader__closeButton__icon}
          />
        </div>
      )}
    </div>
  );
};
