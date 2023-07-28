import { FollowRequestStatus } from '@amityco/js-sdk';
import { toHumanString } from 'human-readable-numbers';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Truncate from 'react-truncate-markup';

import BackLink from '~/core/components/BackLink';
import Button, { PrimaryButton } from '~/core/components/Button';
import ConditionalRender from '~/core/components/ConditionalRender';
import customizableComponent from '~/core/hocs/customization';
import BanIcon from '~/icons/Ban';
import { backgroundImage as UserImage } from '~/icons/User';
import { FollowersTabs, PENDING_TAB } from '~/social/pages/UserFeed/Followers/constants';

import {
  ActionButtonContainer,
  Avatar,
  CheckIconWrapper,
  ClickableCount,
  Container,
  CountContainer,
  Description,
  Header,
  MyProfileContainer,
  NotificationBody,
  NotificationTitle,
  OptionMenu,
  PencilIcon,
  PendingIcon,
  PendingIconContainer,
  PendingNotification,
  PlusIcon,
  ProfileName,
  ProfileNameWrapper,
  TitleEllipse,
  UserBadgesWrapper,
} from './styles';

import { confirm } from '~/core/components/Confirm';
import { notification } from '~/core/components/Notification';
import { useAsyncCallback } from '~/core/hooks/useAsyncCallback';
import useFollowersList from '~/core/hooks/useFollowersList';
import { useSDK } from '~/core/hooks/useSDK';
import useUser from '~/core/hooks/useUser';
import { POSITION_LEFT } from '~/helpers';
import { Check } from '~/icons';
import useReport from '~/social/hooks/useReport';
import { UserFeedTabs } from '~/social/pages/UserFeed/constants';

const UIUserInfo = ({
  userId,
  currentUserId,
  fileUrl,
  displayName,
  description,
  isMyProfile,
  onEditUser,
  onFollowRequest,
  onFollowDecline,
  isFollowPending,
  isFollowNone,
  isFollowAccepted,
  setActiveTab,
  setFollowActiveTab,
  followerCount,
  followingCount,
  isPrivateNetwork,
  userAriseTier,
  userRoles,
}) => {
  const isXsScreen = window.innerWidth < 640;

  const { user } = useUser(userId);
  const { isFlaggedByMe, handleReport } = useReport(user);
  const { formatMessage } = useIntl();
  const { connected } = useSDK();
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
  const [onReportClick] = useAsyncCallback(async () => {
    await handleReport();
    notification.success({
      content: (
        <FormattedMessage id={isFlaggedByMe ? 'report.unreportSent' : 'report.reportSent'} />
      ),
    });
  }, [handleReport]);

  const title = user.displayName
    ? formatMessage({ id: 'user.unfollow.confirm.title' }, { displayName: user.displayName })
    : formatMessage({ id: 'user.unfollow.confirm.title.thisUser' });

  const content = user.displayName
    ? formatMessage({ id: 'user.unfollow.confirm.body' }, { displayName: user.displayName })
    : formatMessage({ id: 'user.unfollow.confirm.body.thisUser' });

  const allOptions = [
    isFollowAccepted &&
      !isMyProfile && {
        name: 'user.unfollow',
        action: () =>
          confirm({
            title,
            content,
            cancelText: formatMessage({ id: 'buttonText.cancel' }),
            okText: formatMessage({ id: 'buttonText.unfollow' }),
            onOk: async () => {
              await onFollowDecline();
              setActiveTab(UserFeedTabs.TIMELINE);
            },
          }),
      },
    !isMyProfile && {
      name: isFlaggedByMe ? 'report.unreportUser' : 'report.reportUser',
      action: onReportClick,
    },
  ].filter(Boolean);

  const [pendingUsers] = useFollowersList(currentUserId, FollowRequestStatus.Pending);

  return (
    <>
      <MyProfileContainer className="!relative xs:!flex justify-center items-center md:!hidden min-h-[50px] h-fit">
        {isMyProfile && <h1 className="!leading-none m-auto cym-h-2-lg">My Profile</h1>}
        <BackLink
          className="absolute left-0 ml-2"
          text={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.6211 19.9141L16.3242 19.2461C16.4648 19.0703 16.4648 18.7891 16.3242 18.6484L9.96094 12.25L16.3242 5.88672C16.4648 5.74609 16.4648 5.46484 16.3242 5.28906L15.6211 4.62109C15.4453 4.44531 15.1992 4.44531 15.0234 4.62109L7.64062 11.9688C7.5 12.1445 7.5 12.3906 7.64062 12.5664L15.0234 19.9141C15.1992 20.0898 15.4453 20.0898 15.6211 19.9141Z"
                fill="#292B32"
              />
            </svg>
          }
        />
      </MyProfileContainer>

      <Container className="xs:block md:hidden" data-qa-anchor="user-info">
        <Header className="!items-center">
          <Avatar
            className="!h-[64px] !w-[64px] !mr-[14px]"
            data-qa-anchor="user-info-profile-image"
            avatar={fileUrl}
            backgroundImage={UserImage}
          />
          <div className="flex flex-col">
            <ProfileNameWrapper>
              <Truncate lines={3}>
                <ProfileName data-qa-anchor="user-info-profile-name">{displayName}</ProfileName>
              </Truncate>

              {user.isGlobalBan && (
                <BanIcon width={14} height={14} css="margin-left: 0.265rem; margin-top: 1px;" />
              )}
            </ProfileNameWrapper>
            {/* Add badges styled compoenent */}

            {(userAriseTier || cymRole) && (
              <UserBadgesWrapper>
                {userAriseTier ? (
                  <span className="whitespace-nowrap rounded-full bg-[#EBF2F1] px-3 py-1 text-[12px] uppercase font-mon font-bold text-[#222222] tracking-[1%]">
                    {' '}
                    {userAriseTier}
                  </span>
                ) : (
                  <span className="hidden">Nothing to see here</span>
                )}

                {cymRole ? (
                  <span className="whitespace-nowrap rounded-full bg-[#EFF0E5] px-3 py-1 text-[12px] uppercase font-mon font-bold text-[#222222] tracking-[1%]">
                    {cymRole}
                  </span>
                ) : (
                  <span className="hidden">Nothing to see here</span>
                )}
              </UserBadgesWrapper>
            )}
            <CountContainer>
              <ClickableCount
                onClick={() => {
                  setActiveTab(UserFeedTabs.FOLLOWERS);
                  setTimeout(() => setFollowActiveTab(FollowersTabs.FOLLOWINGS), 250);
                }}
              >
                {toHumanString(followingCount)}
              </ClickableCount>
              <FormattedMessage id="counter.followings" />
              <ClickableCount
                onClick={() => {
                  setActiveTab(UserFeedTabs.FOLLOWERS);
                  setTimeout(() => setFollowActiveTab(FollowersTabs.FOLLOWERS), 250);
                }}
              >
                {toHumanString(followerCount)}
              </ClickableCount>
              <FormattedMessage id="counter.followers" />
            </CountContainer>
          </div>
        </Header>

        <Description data-qa-anchor="user-info-description">{description}</Description>

        <ActionButtonContainer>
          <ConditionalRender condition={isMyProfile}>
            <Button
              data-qa-anchor="user-info-edit-profile-button"
              disabled={!connected}
              onClick={() => onEditUser(userId)}
            >
              <PencilIcon /> <FormattedMessage id="user.editProfile" />
            </Button>
            <>
              {isPrivateNetwork && isFollowPending && (
                <Button disabled={!connected} onClick={() => onFollowDecline()}>
                  <PendingIconContainer>
                    <PendingIcon />
                  </PendingIconContainer>
                  <FormattedMessage id="user.cancel_follow" />
                </Button>
              )}
              {isFollowNone && (
                <PrimaryButton disabled={!connected} onClick={() => onFollowRequest()}>
                  <PlusIcon /> <FormattedMessage id="user.follow" />
                </PrimaryButton>
              )}
              {isFollowAccepted && (
                // <CheckIconWrapper>
                //   <Check className="w-4" /> <FormattedMessage id="Following" />
                // <CheckIconWrapper/>
                <CheckIconWrapper className="items-center text-cym gap-2">
                  <Check className="w-4 fill-cym" /> <FormattedMessage id="Following" />
                </CheckIconWrapper>
              )}
            </>
          </ConditionalRender>
          <OptionMenu options={allOptions} pullRight={false} align={POSITION_LEFT} />
        </ActionButtonContainer>

        {isMyProfile && pendingUsers.length > 0 && isPrivateNetwork && (
          <PendingNotification
            onClick={() => {
              setActiveTab(UserFeedTabs.FOLLOWERS);
              setTimeout(() => setFollowActiveTab(PENDING_TAB), 250);
            }}
          >
            <NotificationTitle>
              <TitleEllipse />
              <FormattedMessage id="follow.pendingNotification.title" />
            </NotificationTitle>
            <NotificationBody>
              <FormattedMessage id="follow.pendingNotification.body" />
            </NotificationBody>
          </PendingNotification>
        )}
      </Container>

      <Container className="hidden md:block" data-qa-anchor="user-info">
        <Header>
          <Avatar
            data-qa-anchor="user-info-profile-image"
            avatar={fileUrl}
            backgroundImage={UserImage}
          />
          <ActionButtonContainer>
            <ConditionalRender condition={isMyProfile}>
              <Button
                data-qa-anchor="user-info-edit-profile-button"
                disabled={!connected}
                onClick={() => onEditUser(userId)}
              >
                <PencilIcon /> <FormattedMessage id="user.editProfile" />
              </Button>
              <>
                {isPrivateNetwork && isFollowPending && (
                  <Button disabled={!connected} onClick={() => onFollowDecline()}>
                    <PendingIconContainer>
                      <PendingIcon />
                    </PendingIconContainer>
                    <FormattedMessage id="user.cancel_follow" />
                  </Button>
                )}
                {isFollowNone && (
                  <PrimaryButton disabled={!connected} onClick={() => onFollowRequest()}>
                    <PlusIcon /> <FormattedMessage id="user.follow" />
                  </PrimaryButton>
                )}
              </>
            </ConditionalRender>
          </ActionButtonContainer>
          <OptionMenu options={allOptions} pullRight={false} />
        </Header>
        <ProfileNameWrapper>
          <Truncate lines={3}>
            <ProfileName data-qa-anchor="user-info-profile-name">{displayName}</ProfileName>
          </Truncate>

          {user.isGlobalBan && (
            <BanIcon width={14} height={14} css="margin-left: 0.265rem; margin-top: 1px;" />
          )}
        </ProfileNameWrapper>
        {/* Add badges styled compoenent */}

        <UserBadgesWrapper>
          {userAriseTier ? (
            <span className="whitespace-nowrap rounded-full bg-[#EBF2F1] px-3 py-1 text-[12px] uppercase font-mon font-bold text-[#222222] tracking-[1%]">
              {' '}
              {userAriseTier}
            </span>
          ) : (
            <span className="hidden">Nothing to see here</span>
          )}

          {cymRole ? (
            <span className="whitespace-nowrap rounded-full bg-[#EFF0E5] px-3 py-1 text-[12px] uppercase font-mon font-bold text-[#222222] tracking-[1%]">
              {cymRole}
            </span>
          ) : (
            <span className="hidden">Nothing to see here</span>
          )}
        </UserBadgesWrapper>

        <CountContainer>
          <ClickableCount
            onClick={() => {
              setActiveTab(UserFeedTabs.FOLLOWERS);
              setTimeout(() => setFollowActiveTab(FollowersTabs.FOLLOWINGS), 250);
            }}
          >
            {toHumanString(followingCount)}
          </ClickableCount>
          <FormattedMessage id="counter.followings" />
          <ClickableCount
            onClick={() => {
              setActiveTab(UserFeedTabs.FOLLOWERS);
              setTimeout(() => setFollowActiveTab(FollowersTabs.FOLLOWERS), 250);
            }}
          >
            {toHumanString(followerCount)}
          </ClickableCount>
          <FormattedMessage id="counter.followers" />
        </CountContainer>
        <Description data-qa-anchor="user-info-description">{description}</Description>

        {isMyProfile && pendingUsers.length > 0 && isPrivateNetwork && (
          <PendingNotification
            onClick={() => {
              setActiveTab(UserFeedTabs.FOLLOWERS);
              setTimeout(() => setFollowActiveTab(PENDING_TAB), 250);
            }}
          >
            <NotificationTitle>
              <TitleEllipse />
              <FormattedMessage id="follow.pendingNotification.title" />
            </NotificationTitle>
            <NotificationBody>
              <FormattedMessage id="follow.pendingNotification.body" />
            </NotificationBody>
          </PendingNotification>
        )}
      </Container>
    </>
  );
};

UIUserInfo.propTypes = {
  userId: PropTypes.string,
  currentUserId: PropTypes.string,
  userAriseTier: PropTypes.string,
  userRoles: PropTypes.string,
  fileUrl: PropTypes.string,
  displayName: PropTypes.string,
  description: PropTypes.string,
  isMyProfile: PropTypes.bool,
  isFollowPending: PropTypes.bool,
  isFollowNone: PropTypes.bool,
  isFollowAccepted: PropTypes.bool,
  setActiveTab: PropTypes.func,
  setFollowActiveTab: PropTypes.func,
  followerCount: PropTypes.number,
  followingCount: PropTypes.number,
  isPrivateNetwork: PropTypes.bool,
  onEditUser: PropTypes.func,
  onFollowRequest: PropTypes.func,
  onFollowDecline: PropTypes.func,
};

UIUserInfo.defaultProps = {
  userId: '',
  currentUserId: '',
  userAriseTier: '',
  userRoles: '',
  fileUrl: '',
  displayName: '',
  description: '',
  isMyProfile: false,
  onEditUser: () => {},
  onFollowRequest: () => null,
  onFollowDecline: () => null,
  isFollowPending: false,
  isFollowNone: false,
  isFollowAccepted: false,
  setActiveTab: () => null,
  setFollowActiveTab: () => null,
  followerCount: 0,
  followingCount: 0,
};

export default customizableComponent('UIUserInfo', UIUserInfo);
