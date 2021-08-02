import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import Skeleton from '~/core/components/Skeleton';
import customizableComponent from '~/core/hocs/customization';
import Time from '~/core/components/Time';
import Avatar from '~/core/components/Avatar';
import { backgroundImage as UserImage } from '~/icons/User';
import {
  Name,
  PostInfo,
  ShieldIcon,
  ModeratorBadge,
  AdditionalInfo,
  ArrowSeparatorContainer,
  ArrowSeparator,
  PostHeaderContainer,
  PostNamesContainer,
  MessageContainer,
} from './styles';

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
}) => {
  const renderPostNames = () => {
    const authorName = (
      <Name onClick={onClickUser} className={cx({ clickable: !!onClickUser })}>
        {postAuthorName}
      </Name>
    );
    if (!postTargetName || hidePostTarget) return authorName;
    return (
      <PostNamesContainer>
        {authorName}
        <ArrowSeparatorContainer>
          <ArrowSeparator />
        </ArrowSeparatorContainer>
        <Name onClick={onClickCommunity} className={cx({ clickable: !!onClickCommunity })}>
          {postTargetName}
        </Name>
      </PostNamesContainer>
    );
  };

  const renderAdditionalInfo = () => {
    return (
      <AdditionalInfo showTime={!!timeAgo}>
        {isModerator && (
          <ModeratorBadge>
            <ShieldIcon /> <FormattedMessage id="moderator" />
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
        avatar={avatarFileUrl}
        backgroundImage={UserImage}
        onClick={onClickUser}
        loading={loading}
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
  avatarFileUrl: PropTypes.string,
  postAuthorName: PropTypes.node,
  postTargetName: PropTypes.string,
  timeAgo: PropTypes.instanceOf(Date),
  isModerator: PropTypes.bool,
  isEdited: PropTypes.bool,
  onClickCommunity: PropTypes.func,
  onClickUser: PropTypes.func,
  hidePostTarget: PropTypes.bool,
  loading: PropTypes.bool,
};

UIPostHeader.defaultProps = {
  avatarFileUrl: '',
  postAuthorName: '',
  postTargetName: '',
  timeAgo: null,
  isModerator: false,
  isEdited: false,
  onClickCommunity: null,
  onClickUser: null,
  hidePostTarget: false,
  loading: false,
};

export default customizableComponent('UIPostHeader', UIPostHeader);
