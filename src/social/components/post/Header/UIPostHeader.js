import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import TruncateMarkup from 'react-truncate-markup';
import Skeleton from '~/core/components/Skeleton';
import customizableComponent from '~/core/hocs/customization';
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

const UIPostHeader = ({
  avatarFileUrl,
  postAuthorName,
  postAuthorTier,
  postTargetName,
  timeAgo,
  isModerator,
  isEdited,
  onClickCommunity,
  onClickUser,
  hidePostTarget,
  loading,
  isBanned,
}) => {
  const renderPostNames = () => {
    return (
      <div>
        <PostNamesContainer data-qa-anchor="post-header-post-names">
          <TruncateMarkup lines={3}>
            <Name
              data-qa-anchor="post-header-post-name"
              className={cx({ clickable: !!onClickUser })}
              onClick={onClickUser}
            >
              {postAuthorName} <br />
            </Name>
          </TruncateMarkup>

          {isBanned && <BanIcon height={14} width={14} />}

          {postTargetName && !hidePostTarget && (
            <>
              <ArrowSeparator />
              <Name
                data-qa-anchor="post-header-post-target-name"
                className={cx({ clickable: !!onClickCommunity })}
                onClick={onClickCommunity}
              >
                {postTargetName}
              </Name>
            </>
          )}
        </PostNamesContainer>
        {postAuthorTier ? (
          <div className="my-[5px]">
            <span className="whitespace-nowrap rounded-full bg-[#EBF2F1] px-3 py-1 text-[12px] uppercase font-mon font-bold text-[#222222] tracking-[1%]">
              {postAuthorTier}
            </span>
          </div>
        ) : (
          <span className="hidden">Nothing to see here</span>
        )}
      </div>
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

        {timeAgo && <Time data-qa-anchor="post-header-additional-info-time-ago" date={timeAgo} />}

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

UIPostHeader.propTypes = {
  avatarFileUrl: PropTypes.string,
  postAuthorName: PropTypes.node,
  postAuthorTier: PropTypes.node,
  postTargetName: PropTypes.string,
  timeAgo: PropTypes.instanceOf(Date),
  isModerator: PropTypes.bool,
  isEdited: PropTypes.bool,
  hidePostTarget: PropTypes.bool,
  loading: PropTypes.bool,
  isBanned: PropTypes.bool,
  onClickCommunity: PropTypes.func,
  onClickUser: PropTypes.func,
};

UIPostHeader.defaultProps = {
  avatarFileUrl: '',
  postAuthorName: '',
  postAuthorTier: '',
  postTargetName: '',
  timeAgo: null,
  isModerator: false,
  isEdited: false,
  hidePostTarget: false,
  loading: false,
  isBanned: false,
  onClickCommunity: null,
  onClickUser: null,
};

export default customizableComponent('UIPostHeader', UIPostHeader);
