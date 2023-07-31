import { PostTargetType } from '@amityco/js-sdk';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PageTypes, userId } from '~/social/constants';

import MainLayout from '~/social/layouts/Main';

import CustomFooterNav from '~/core/components/CustomFooterNav';
import CustomHeader from '~/core/components/CustomHeader';
import useFollow from '~/core/hooks/useFollow';
import useUser from '~/core/hooks/useUser';
import CommunitySideMenu, { SocialSearch } from '~/social/components/CommunitySideMenu';
import CreatePostOverlay from '~/social/components/CreatePostOverlay';
import MobilePostButton from '~/social/components/MobilePostButton';
import ProfileSettings from '~/social/components/ProfileSettings';
import SideSectionMyCommunity from '~/social/components/SideSectionMyCommunity';
import CategoryCommunitiesPage from '~/social/pages/CategoryCommunities';
import CommunityEditPage from '~/social/pages/CommunityEdit';
import CommunityFeedPage from '~/social/pages/CommunityFeed';
import ExplorePage from '~/social/pages/Explore';
import NewsFeedPage from '~/social/pages/NewsFeed';
import UserFeedPage from '~/social/pages/UserFeed';
import { useNavigation } from '~/social/providers/NavigationProvider';
import NotificationTargetPage from '../NotificationTargetPage';
import ServerAPI from './ServerAPI';

// import Custom from '~/chat/components/Message/MessageContent/Custom';

const ApplicationContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const StyledCommunitySideMenu = styled(CommunitySideMenu)`
  min-height: 100%;
  display: none;
  @media screen and (min-width: 768px) {
    display: block;
  }
`;
const Community = () => {
  const server = ServerAPI();

  const { onChangePage } = useNavigation();

  const [refresh, setRefresh] = useState(0);
  const { user } = useUser(userId);
  const ariseFollow = useFollow(userId, '6405802983471');
  const chervinFollow = useFollow(userId, '699914223639');

  useEffect(() => {
    const diffInMilliseconds = Math.abs(user.createdAt - new Date());
    const fiveMinutesInMilliseconds = 5 * 60 * 1000; // 5 minutes in milliseconds
    if (diffInMilliseconds <= fiveMinutesInMilliseconds) {
      setTimeout(async () => {
        try {
          await chervinFollow.follow();
        } catch (error) {
          console.error('Error following chervin:', error);
        }

        try {
          await ariseFollow.follow();
        } catch (error) {
          console.error('Error following arise:', error);
        }
        // 'refresh' feed
        setTimeout(() => {
          onChangePage(PageTypes.Explore);
          setTimeout(() => {
            onChangePage(PageTypes.NewsFeed);
          }, 100);
        }, 1000);
      }, 1000);
    }
  }, [user]);

  // useEffect(() => {
  //   // const followAndRefresh = async()=>{
  //   //   setTimeout(() => {
  //   //     await ariseFollow.follow();
  //   //   }, 1000);
  //   // }
  //   setTimeout(async () => {
  //     try {
  //       await chervinFollow.follow();
  //     } catch (error) {
  //       console.error('Error following chervin:', error);
  //     }

  //     try {
  //       await ariseFollow.follow();
  //     } catch (error) {
  //       console.error('Error following arise:', error);
  //     }

  //     // After following, wait for 2 seconds and then navigate to Explore
  //     setTimeout(() => {
  //       onChangePage(PageTypes.Explore);
  //       // After navigating to Explore, wait for another 2 seconds and then navigate to NewsFeed
  //       setTimeout(() => {
  //         onChangePage(PageTypes.NewsFeed);
  //       }, 100);
  //     }, 1000);
  //   }, 2000);
  // }, []);
  const customerId = window.shopifyCustomerId || userId;
  const { page, onClickUser } = useNavigation();

  const [feedType, setFeedType] = useState('');
  const [feedTargetId, setFeedTargetId] = useState('');
  const handleClickUser = (userId) => onClickUser(userId);

  const assignFeedType = () => {
    if (page.type === 'communityfeed') {
      setFeedType(PostTargetType.CommunityFeed);
    } else {
      setFeedType(PostTargetType.UserFeed);
    }
  };
  const assignTargetId = () => {
    if (page.type === 'communityfeed') {
      setFeedTargetId(window.communityId);
    } else if (page.type === 'newsfeed') {
      setFeedTargetId(customerId);
    } else {
      setFeedTargetId(page.userId);
    }
  };
  useEffect(() => {
    assignFeedType();
    assignTargetId();
  }, [page.type]);
  return (
    <ApplicationContainer id="ApplicationContainer">
      <CreatePostOverlay targetType={feedType} targetId={feedTargetId} userId={page.userId} />
      <CustomHeader
        id="custom-header-wrapper-md"
        className="hidden md:block"
        userId={page.userId}
        onClickUser={handleClickUser}
      />
      <MainLayout
        aside={<StyledCommunitySideMenu activeCommunity={page.communityId} id="main-layout" />}
      >
        <CustomHeader
          id="custom-header-wrapper-mobile"
          className="md:!hidden"
          userId={page.userId}
          onClickUser={handleClickUser}
        />

        {/* <div className="xs:pt-[54px] md:pt-0"> */}
        {page.type === PageTypes.Explore && <ExplorePage />}

        {page.type === PageTypes.NewsFeed && <NewsFeedPage refresh={refresh} />}

        {page.type === PageTypes.CommunityFeed && (
          <CommunityFeedPage communityId={page.communityId} isNewCommunity={page.isNewCommunity} />
        )}

        {page.type === PageTypes.CommunityEdit && (
          <CommunityEditPage communityId={page.communityId} tab={page.tab} />
        )}

        {page.type === PageTypes.Category && (
          <CategoryCommunitiesPage categoryId={page.categoryId} />
        )}

        {page.type === PageTypes.UserFeed && <UserFeedPage userId={page.userId} />}

        {page.type === PageTypes.UserEdit && <ProfileSettings userId={page.userId} />}

        {page.type === PageTypes.MyGroups && (
          <SideSectionMyCommunity activeCommunity={page.communityId} showCreateButton />
        )}
        {page.type === PageTypes.Search && <SocialSearch />}
        {page.type === PageTypes.NotificationTarget && (
          <NotificationTargetPage targetId={page.targetId} />
        )}
        {/* </div> */}

        <MobilePostButton />
        <CustomFooterNav onClickUser={handleClickUser} page={page.type} />
      </MainLayout>
    </ApplicationContainer>
  );
};;

export default Community;
