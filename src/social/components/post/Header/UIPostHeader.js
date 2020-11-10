import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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
} from './styles';

const UIPostHeader = ({
  avatarFileUrl,
  postAuthorName,
  postTargetName,
  timeAgo,
  isModerator,
  onClickUser,
}) => {
  const renderPostNames = () => {
    const authorName = <Name onClick={onClickUser}>{postAuthorName}</Name>;
    if (!postTargetName) return authorName;
    return (
      <PostNamesContainer>
        {authorName}
        <ArrowSeparatorContainer>
          <ArrowSeparator />
        </ArrowSeparatorContainer>
        <Name>{postTargetName}</Name>
      </PostNamesContainer>
    );
  };

  const renderAdditionalInfo = () => {
    const time = timeAgo ? <Time date={timeAgo} /> : null;
    if (!isModerator) return time;
    return (
      <AdditionalInfo showTime={!!time}>
        <ModeratorBadge>
          <ShieldIcon /> <FormattedMessage id="moderator" />
        </ModeratorBadge>
        {cloneElement(time, { className: 'time' })}
      </AdditionalInfo>
    );
  };

  return (
    <PostHeaderContainer>
      <Avatar avatar={avatarFileUrl} backgroundImage={UserImage} />
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
  isModerator: PropTypes.bool,
  onClickUser: PropTypes.func,
};

UIPostHeader.defaultProps = {
  avatarFileUrl: '',
  postAuthorName: '',
  postTargetName: '',
  timeAgo: null,
  isModerator: false,
  onClickUser: () => {},
};

export default customizableComponent('UIPostHeader', UIPostHeader);
