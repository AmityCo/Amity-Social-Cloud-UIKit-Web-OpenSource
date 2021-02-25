import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import customizableComponent from '~/core/hocs/customization';
import Time from '~/core/components/Time';
import Avatar from '~/core/components/Avatar';
import ConditionalRender from '~/core/components/ConditionalRender';
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
  isCommunityModerator,
  isEdited,
  onClickCommunity,
  onClickUser,
  hidePostTarget,
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
        <ConditionalRender condition={isCommunityModerator}>
          <ModeratorBadge>
            <ShieldIcon /> <FormattedMessage id="moderator" />
          </ModeratorBadge>
        </ConditionalRender>
        <ConditionalRender condition={timeAgo}>
          <Time date={timeAgo} />
        </ConditionalRender>
        <ConditionalRender condition={isEdited}>
          <MessageContainer>
            <FormattedMessage id="post.edited" />
          </MessageContainer>
        </ConditionalRender>
      </AdditionalInfo>
    );
  };

  return (
    <PostHeaderContainer>
      <Avatar avatar={avatarFileUrl} backgroundImage={UserImage} onClick={onClickUser} />
      <PostInfo>
        {renderPostNames()}
        {renderAdditionalInfo()}
      </PostInfo>
    </PostHeaderContainer>
  );
};

UIPostHeader.propTypes = {
  avatarFileUrl: PropTypes.string,
  postAuthorName: PropTypes.string,
  postTargetName: PropTypes.string,
  timeAgo: PropTypes.instanceOf(Date),
  isCommunityModerator: PropTypes.bool,
  isEdited: PropTypes.bool,
  onClickCommunity: PropTypes.func,
  onClickUser: PropTypes.func,
  hidePostTarget: PropTypes.bool,
};

UIPostHeader.defaultProps = {
  avatarFileUrl: '',
  postAuthorName: '',
  postTargetName: '',
  timeAgo: null,
  isCommunityModerator: false,
  isEdited: false,
  onClickCommunity: null,
  onClickUser: null,
  hidePostTarget: false,
};

export default customizableComponent('UIPostHeader', UIPostHeader);
