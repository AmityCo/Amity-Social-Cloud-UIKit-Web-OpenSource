import { AmityUserTokenManager, ApiRegion } from '@amityco/js-sdk';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Avatar from '~/core/components/Avatar';
import { backgroundImage as UserImage } from '~/icons/User';
import { apiKey, userId } from '~/social/constants';
import usePost from '~/social/hooks/usePost';
import { useNavigation } from '~/social/providers/NavigationProvider';
import ServerAPI from '../AriseTokens/ServerAPI';

const SlideOutContainer = styled.div`
  @media screen and (max-width: 768px) {
    width: 100vw;
    right: -100vw;
  }
  @media screen and (min-width: 769px) {
    width: 400px;
    right: -400px;
  }
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: white;
  transition: right 0.2s ease-in-out;
  z-index: 2;

  &.open {
    right: 0;
  }
`;

const SlideOutHeader = styled.div`
  width: 100%;
  height: 58px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
const SlideOutContent = styled.div`
  padding: 16px 0;
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const SlideOutOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease-in-out;
  opacity: 0;
  pointer-events: none;
  z-index: 1;

  &.open {
    opacity: 1;
    pointer-events: auto;
  }
`;

const NotificationTray = () => {
  // const { post, file, user } = usePost('64b5765e84f9df8fd3329ef5');
  const { onClickCommunity, onChangePage, onClickNotification } = useNavigation();
  console.log(usePost('64b5765e84f9df8fd3329ef5'));
  console.log('SADFSDAFSDAFSDAFDSAF', useNavigation());
  const [isMobile, setIsMobile] = useState(false);
  const [timeRanges, setTimeRanges] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [fetchedNotifications, setFetchedNotificaiotns] = useState(null);

  useEffect(() => {
    if (fetchedNotifications) setTimeRanges(groupByTimeRange(fetchedNotifications.data));
  }, [fetchedNotifications]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function getAccessToken() {
    const { accessToken, err } = await AmityUserTokenManager.createUserToken(apiKey, ApiRegion.US, {
      userId: userId,
    });
    return accessToken;
  }
  const fetchNotifications = async () => {
    try {
      const server = new ServerAPI();
      const accessToken = await getAccessToken();
      const notifications = await server.getNotifications(accessToken);
      setFetchedNotificaiotns(notifications);
    } catch (error) {
      console.error('Error fetching notifications data:', error);
    }
  };
  const setReadNotification = async (noti) => {
    try {
      const server = new ServerAPI();
      const accessToken = await getAccessToken();
      const notifications = await server.setReadNotification(accessToken, noti);
      // setFetchedNotificaiotns(notifications);
    } catch (error) {
      console.error('Error fetching notifications data:', error);
    }
  };

  function getTimeAgo(timestamp) {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - timestamp;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 12 * month;

    if (timeDifference < hour) {
      const minutesDifference = Math.floor(timeDifference / minute);
      return `${minutesDifference}min`;
    } else if (timeDifference < day) {
      const hoursDifference = Math.floor(timeDifference / hour);
      return `${hoursDifference}hr`;
    } else if (timeDifference < week) {
      const daysDifference = Math.floor(timeDifference / day);
      return `${daysDifference}d`;
    } else if (timeDifference < month) {
      const weeksDifference = Math.floor(timeDifference / week);
      return `${weeksDifference}w`;
    } else if (timeDifference < year) {
      const monthsDifference = Math.floor(timeDifference / month);
      return `${monthsDifference}m`;
    } else {
      const yearsDifference = Math.floor(timeDifference / year);
      return `${yearsDifference}y`;
    }
  }

  function groupByTimeRange(objects) {
    const currentTime = new Date().getTime();
    const today = [];
    const thisWeek = [];
    const thisMonth = [];
    const earlier = [];

    for (const obj of objects) {
      const timestamp = obj.lastUpdate;
      const timeAgo = getTimeAgo(timestamp);

      if (timeAgo.endsWith('hr') || timeAgo.endsWith('min')) {
        today.push(obj);
      } else if (timeAgo.endsWith('d') && !timeAgo.startsWith('0d')) {
        thisWeek.push(obj);
      } else if (timeAgo.endsWith('w') && !timeAgo.startsWith('0w')) {
        thisMonth.push(obj);
      } else if (timeAgo.endsWith('y ago') && !timeAgo.startsWith('0 y')) {
        earlier.push(obj);
      }
    }

    return {
      today: { title: 'Today', arr: today },
      thisWeek: { title: 'This Week', arr: thisWeek },
      thisMonth: { title: 'This Month', arr: thisMonth },
      earlier: { title: 'Earlier', arr: earlier },
    };
  }

  async function handleClick(notification) {
    if (notification.targetType === 'post') {
      onClickNotification(notification.targetId);
    } else if (notification.targetType === 'community') onClickCommunity(notification.targetId);
    else {
    }
    toggleSlideOut();
    if (!notification.hasRead) {
      await setReadNotification(notification);
      fetchNotifications();
    }
    // fetchNotifications();
    return;
  }
  // const fetchedNotifications = {
  //   totalPages: 1,
  //   data: [
  //     {
  //       lastUpdate: 1689613959019,
  //       targetType: 'post',
  //       verb: 'comment',
  //       v_tarid_uid:
  //         'comment_646e56c141806b9156f6cf94_64b5765e84f9df8fd3329ef5_649452f09c62fbba03462786',
  //       hasRead: false,
  //       imageUrl: 'https://api.us.amity.co/api/v3/files/3a60f66b82284a0bb6269ec2b8e7e289/download',
  //       avatarCustomUrl: '',
  //       targetName: 'undefined',
  //       actors: [
  //         {
  //           name: 'Hector ShopifyId',
  //         },
  //       ],
  //       actorsCount: 1,
  //       parentTargetId: '64b5765e84f9df8fd3329ef5',
  //       targetId: '64b5765e84f9df8fd3329ef5',
  //       description: 'Hector ShopifyId commented on your post',
  //     },
  //     {
  //       lastUpdate: 1689613937039,
  //       targetType: 'post',
  //       verb: 'reaction',
  //       v_tarid_uid:
  //         'reaction_646e56c141806b9156f6cf94_64b5765e84f9df8fd3329ef5_649452f09c62fbba03462786',
  //       hasRead: false,
  //       imageUrl: 'https://api.us.amity.co/api/v3/files/3a60f66b82284a0bb6269ec2b8e7e289/download',
  //       avatarCustomUrl: '',
  //       targetName: 'Test Test',
  //       actors: [
  //         {
  //           name: 'Hector ShopifyId',
  //         },
  //       ],
  //       actorsCount: 1,
  //       parentTargetId: '3454838145071',
  //       targetId: '64b5765e84f9df8fd3329ef5',
  //       description: 'Hector ShopifyId added a reaction to your post in Test Test',
  //     },
  //     {
  //       lastUpdate: 1689197059035,
  //       targetType: 'community',
  //       verb: 'post',
  //       v_tarid_uid:
  //         'post_646e56c141806b9156f6cf94_649b243a2b963c70c54750bf_649452f09c62fbba03462786',
  //       hasRead: false,
  //       imageUrl: 'https://api.us.amity.co/api/v3/files/05712cebe0774e178c17acda3f43ab5f/download',
  //       avatarCustomUrl: '',
  //       targetName: 'Non-Toxic Living',
  //       actors: [
  //         {
  //           name: 'Hannah',
  //         },
  //       ],
  //       actorsCount: 1,
  //       parentTargetId: '',
  //       targetId: '649b243a2b963c70c54750bf',
  //       description: 'Hannah posted in Non-Toxic Living',
  //     },
  //     {
  //       lastUpdate: 1689193472827,
  //       targetType: 'community',
  //       verb: 'post',
  //       v_tarid_uid:
  //         'post_646e56c141806b9156f6cf94_649b23322be19926f2f4d0af_649452f09c62fbba03462786',
  //       hasRead: false,
  //       imageUrl: 'https://api.us.amity.co/api/v3/files/05712cebe0774e178c17acda3f43ab5f/download',
  //       avatarCustomUrl: '',
  //       targetName: 'Gut Health',
  //       actors: [
  //         {
  //           name: 'Hannah',
  //         },
  //       ],
  //       actorsCount: 1,
  //       parentTargetId: '',
  //       targetId: '649b23322be19926f2f4d0af',
  //       description: 'Hannah posted in Gut Health',
  //     },
  //   ],
  // };

  const toggleSlideOut = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {fetchedNotifications &&
        fetchedNotifications?.data?.some((noti) => noti.hasRead === false) && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center p-1 !text-[10px] font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"></span>
        )}
      <svg
        onClick={toggleSlideOut}
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[16px] h-[16px] cursor-pointer"
      >
        <path
          d="M18 8.5C18 6.9087 17.3679 5.38258 16.2426 4.25736C15.1174 3.13214 13.5913 2.5 12 2.5C10.4087 2.5 8.88258 3.13214 7.75736 4.25736C6.63214 5.38258 6 6.9087 6 8.5C6 15.5 3 17.5 3 17.5H21C21 17.5 18 15.5 18 8.5Z"
          stroke="#005850"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M13.73 21.5C13.5542 21.8031 13.3019 22.0547 12.9982 22.2295C12.6946 22.4044 12.3504 22.4965 12 22.4965C11.6496 22.4965 11.3054 22.4044 11.0018 22.2295C10.6982 22.0547 10.4458 21.8031 10.27 21.5"
          stroke="#005850"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <SlideOutOverlay className={`${isOpen ? 'open' : ''}`} onClick={toggleSlideOut} />
      <SlideOutContainer className={` ${isOpen ? 'open' : ''} flex flex-col h-full`}>
        <SlideOutHeader>
          <svg
            className="xs:hidden md:block absolute ml-3 left-0 cursor-pointer"
            onClick={toggleSlideOut}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <svg
            className="xs:block md:hidden absolute ml-3 left-0 cursor-pointer"
            onClick={toggleSlideOut}
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

          <h1 className="cym-h-2-lg">Notifications</h1>
        </SlideOutHeader>
        <SlideOutContent className="flex flex-col h-full overflow-y-auto">
          {console.log(timeRanges)}
          {Object.keys(timeRanges).map((dateRange) => {
            if (timeRanges[dateRange].arr.length > 0) {
              return (
                <>
                  <h1 className="cym-title mt-4 mb-3 px-4">{timeRanges[dateRange].title}</h1>
                  {timeRanges[dateRange].arr.map((noti) => (
                    <div
                      onClick={() => handleClick(noti)}
                      className={`px-4 cursor-pointer border-b-2 border-b-cym-lightergrey flex py-3 min-h-[68px] items-center gap-3 ${
                        noti.hasRead ? '' : 'bg-cym-lightteal'
                      }`}
                    >
                      <Avatar avatar={noti.imageUrl} backgroundImage={UserImage} />
                      <p>
                        {noti.description}.{' '}
                        <span className="text-cym-placeholdergrey">
                          {getTimeAgo(noti.lastUpdate)}
                        </span>
                      </p>
                    </div>
                  ))}
                </>
              );
            }
            return null;
          })}
          {/* {mockNotis.data.map((noti) => (
            <div className="box-content flex py-3 min-h-[44px] items-center gap-3">
              <Avatar avatar={noti.imageUrl} backgroundImage={UserImage} />
              <p>
                {noti.description}.{' '}
                <span className="text-cym-placeholdergrey">{getTimeAgo(noti.lastUpdate)}</span>
              </p>
            </div>
          ))} */}
        </SlideOutContent>
      </SlideOutContainer>
    </div>
  );
};;

export default NotificationTray;
