import React from 'react';
import { FormattedMessage } from 'react-intl';
import cx from 'clsx';
import Truncate from 'react-truncate-markup';
import Skeleton from '~/core/components/Skeleton';

import Time from '~/core/components/Time';
import Avatar from '~/core/components/Avatar';
import BanIcon from '~/icons/Ban';
import { backgroundImage as UserImage } from '~/icons/User';
import {
  Name,
  PostInfo,
  ShieldIcon,
  ModeratorBadge,
  AdditionalInfo,
  ArrowSeparator,
  PostHeaderContainer,
  PostNamesContainer,
  MessageContainer,
} from './styles';
import { usePostHeaderProps } from './hooks';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

type UIPostHeaderProps = ReturnType<typeof usePostHeaderProps>;

const UIPostHeader = ({
  avatarFileUrl,
  postAuthorName,
  postTargetName,
  timeAgo,
  isModerator,
  isEdited,
  onClickCommunity,
  onClickUser,
  hidePostTarget,
  loading,
  isBanned,
}: UIPostHeaderProps) => {
  const CustomComponentFn = useCustomComponent<UIPostHeaderProps>('UIPostHeader');

  if (CustomComponentFn)
    return CustomComponentFn({
      avatarFileUrl,
      postAuthorName,
      postTargetName,
      timeAgo,
      isModerator,
      isEdited,
      onClickCommunity,
      onClickUser,
      hidePostTarget,
      loading,
      isBanned,
    });

  const renderPostNames = () => {
    return (
      <PostNamesContainer data-qa-anchor="post-header-post-names">
        <Truncate lines={3}>
          <Name
            data-qa-anchor="post-header-post-name"
            className={cx({ clickable: !!onClickUser })}
            onClick={onClickUser}
          >
            {postAuthorName}
          </Name>
        </Truncate>

        {isBanned && <BanIcon />}

        {postTargetName && !hidePostTarget && (
          <>
            <ArrowSeparator />
            <Name
              data-qa-anchor="post-header-post-target-name"
              className={cx({ clickable: !!onClickCommunity })}
              onClick={onClickCommunity || undefined}
            >
              {postTargetName}
            </Name>
          </>
        )}
      </PostNamesContainer>
    );
  };

  const renderAdditionalInfo = () => {
    return (
      <AdditionalInfo data-qa-anchor="post-header-additional-info" showTime={!!timeAgo}>
        {isModerator && (
          <ModeratorBadge data-qa-anchor="post-header-additional-info-moderator-badge">
            <ShieldIcon /> <FormattedMessage id="moderator" />
          </ModeratorBadge>
        )}

        {timeAgo && (
          <Time data-qa-anchor="post-header-additional-info-time-ago" date={timeAgo.getTime()} />
        )}

        {isEdited && (
          <MessageContainer data-qa-anchor="post-header-additional-info-edited-label">
            <FormattedMessage id="post.edited" />
          </MessageContainer>
        )}
      </AdditionalInfo>
    );
  };

  return (
    <PostHeaderContainer data-qa-anchor="post-header">
      <Avatar
        data-qa-anchor="post-header-avatar"
        avatar={avatarFileUrl}
        backgroundImage={UserImage}
        loading={loading}
        onClick={onClickUser}
      />
      <PostInfo data-qa-anchor="post-header-post-info">
        {loading ? (
          <>
            <div>
              <Skeleton width={96} style={{ fontSize: 8 }} />
            </div>
            <Skeleton width={189} style={{ fontSize: 8 }} />
          </>
        ) : (
          <>
            {renderPostNames()}
            {renderAdditionalInfo()}
          </>
        )}
      </PostInfo>
    </PostHeaderContainer>
  );
};

export default UIPostHeader;
