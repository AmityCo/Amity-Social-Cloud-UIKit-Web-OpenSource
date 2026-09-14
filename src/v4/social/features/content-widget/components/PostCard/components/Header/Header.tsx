import { Typography } from '~/v4/core/components';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { BrandBadge } from '~/v4/social/elements';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge';
import { Timestamp } from '~/v4/social/elements/Timestamp';
import AngleRight from '~/v4/icons/AngleRight';
import styles from './Header.module.css';

type HeaderProps = {
  pageId?: string;
  componentId?: string;
  post: Amity.Post;
};

export function Header({ pageId = '*', componentId = '*', post }: HeaderProps) {
  const isCommunityTarget = post.targetType === 'community';
  const { community } = useCommunity({
    communityId: post.targetId,
    shouldCall: isCommunityTarget,
  });

  const showCommunity = isCommunityTarget && !!community;
  const isBrand = post.creator?.isBrand;
  const isOfficialCommunity = community?.isOfficial === true;

  return (
    <div className={styles.cardHeader}>
      <UserAvatar
        pageId={pageId}
        componentId={componentId}
        userId={post.postedUserId}
        className={styles.cardHeader__avatar}
      />
      <div className={styles.cardHeader__content}>
        <div className={styles.cardHeader__titleRow}>
          <div className={styles.cardHeader__displayNameWrap}>
            <Typography.BodyBold className={styles.cardHeader__displayName}>
              {post.creator?.displayName}
            </Typography.BodyBold>
            {isBrand && (
              <BrandBadge
                pageId={pageId}
                componentId={componentId}
                className={styles.cardHeader__badge}
              />
            )}
          </div>
          {showCommunity && (
            <>
              <span className={styles.cardHeader__arrow} aria-hidden="true">
                <AngleRight className={styles.cardHeader__arrowIcon} />
              </span>
              <div className={styles.cardHeader__communityWrap}>
                <Typography.BodyBold className={styles.cardHeader__communityName}>
                  {community.displayName}
                </Typography.BodyBold>
                {isOfficialCommunity && (
                  <CommunityOfficialBadge
                    pageId={pageId}
                    componentId={componentId}
                    className={styles.cardHeader__badge}
                  />
                )}
              </div>
            </>
          )}
        </div>
        <div className={styles.cardHeader__subtitleRow}>
          <Timestamp timestamp={post.createdAt} className={styles.cardHeader__timestamp} />
        </div>
      </div>
    </div>
  );
}
