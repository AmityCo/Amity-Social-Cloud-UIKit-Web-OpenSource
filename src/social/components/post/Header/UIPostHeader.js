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
  userTag,
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
}) => {
  const renderPostNames = () => {
    return (
      <PostNamesContainer>
        <TruncateMarkup lines={3}>
          <Name className={cx({ clickable: !!onClickUser })} onClick={onClickUser}>
            {postAuthorName}
          </Name>
        </TruncateMarkup>

        {isBanned && <BanIcon height={14} width={14} />}

        {postTargetName && !hidePostTarget && (
          <>
            <ArrowSeparator />
            <Name className={cx({ clickable: !!onClickCommunity })} onClick={onClickCommunity}>
              {postTargetName}
            </Name>
          </>
        )}
      </PostNamesContainer>
    );
  };

  const renderAdditionalInfo = () => {
    return (
      <AdditionalInfo showTime={!!timeAgo}>
        {isModerator && (
          <ModeratorBadge>
            <ShieldIcon width={14} height={14} /> <FormattedMessage id="moderator" />
          </ModeratorBadge>
        )}
        {userTag && (
          <ModeratorBadge>
            <FormattedMessage id={`userType.${userTag}`} />
          </ModeratorBadge>
        )}
        {timeAgo && <Time date={timeAgo} />}
        {isEdited && (
          <MessageContainer>
            <FormattedMessage id="post.edited" />
          </MessageContainer>
        )}
      </AdditionalInfo>
    );
  };
  return (
    <PostHeaderContainer>
      <Avatar
        displayName={typeof postAuthorName === 'string' ? postAuthorName : undefined}
        avatar={avatarFileUrl}
        backgroundImage={UserImage}
        loading={loading}
        onClick={onClickUser}
      />
      <PostInfo>
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
  userTag: PropTypes.string,
  avatarFileUrl: PropTypes.string,
  postAuthorName: PropTypes.node,
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
