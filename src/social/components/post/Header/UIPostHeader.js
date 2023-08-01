import cx from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TruncateMarkup from 'react-truncate-markup';
import Avatar from '~/core/components/Avatar';
import Skeleton from '~/core/components/Skeleton';
import Time from '~/core/components/Time';
import customizableComponent from '~/core/hocs/customization';
import BanIcon from '~/icons/Ban';
import { backgroundImage as UserImage } from '~/icons/User';
import {
  AdditionalInfo,
  ArrowSeparator,
  MessageContainer,
  ModeratorBadge,
  Name,
  PostHeaderContainer,
  PostInfo,
  PostNamesContainer,
  ShieldIcon,
} from './styles';
import { userId } from '~/social/constants';

console.log(userId);

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
  userRoles,
}) => {
  const renderPostNames = () => {
    let cymRole;
    switch (userRoles[0]) {
      case '6412fc76-ef6c-476c-ba45-17063dfed0ba':
        cymRole = 'Cymbiologist';
        break;
      case 'edc90e79-1920-4da2-9176-defad5f70f8e':
        cymRole = 'Cymbiotika Curated';
        break;
      case '4e31d2e1-7ab8-4a63-b1b9-bd7383612ac9':
        cymRole = 'Founder';
        break;
      case '19ee7e0e-e137-4c86-84f5-88bc27fb6504':
        cymRole = 'Community Moderator';
        break;
      default:
        console.log('This user has no Cymbiotika roles');
    }

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
            <span className="whitespace-nowrap rounded-full bg-[#EBF2F1] px-2 py-1 text-[12px] uppercase font-mon font-bold text-[#222222] tracking-[1%]">
              {postAuthorTier}
            </span>
          </div>
        ) : (
          <span className="hidden">Nothing to see here</span>
        )}

        {cymRole ? (
          <div className="my-[5px]">
            <span className="whitespace-nowrap rounded-full bg-[#EBF2F1] px-2 py-1 text-[12px] uppercase font-mon font-bold text-[#222222] tracking-[1%]">
              {cymRole}
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
  userRoles: PropTypes.string,
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
  userRoles: '',
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
