import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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
  isModerator,
  isEdited,
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
    return (
      <AdditionalInfo showTime={!!timeAgo}>
        <ConditionalRender condition={isModerator}>
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
  isEdited: PropTypes.bool,
  onClickUser: PropTypes.func,
};

UIPostHeader.defaultProps = {
  avatarFileUrl: '',
  postAuthorName: '',
  postTargetName: '',
  timeAgo: null,
  isModerator: false,
  isEdited: false,
  onClickUser: () => {},
};

export default customizableComponent('UIPostHeader', UIPostHeader);
