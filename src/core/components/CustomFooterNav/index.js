import { PageTypes, userId } from '~/social/constants';
import { useNavigation } from '~/social/providers/NavigationProvider';

import { useState } from 'react';
import useUser from '~/core/hooks/useUser';
function CustomFooterNav({ onClickUser }) {
  const { user, file } = useUser(userId);
  const { onChangePage, page } = useNavigation();
  const [selectedTab, setSelectedTab] = useState('News Feed');

  const menuTabs = [
    {
      name: 'News Feed',
      func: () => onChangePage(PageTypes.NewsFeed),
      svg: (
        <svg
          width="23"
          height="23"
          viewBox="0 0 23 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.6249 20.346C16.6875 20.346 20.7916 16.242 20.7916 11.1794C20.7916 6.11675 16.6875 2.0127 11.6249 2.0127C6.56231 2.0127 2.45825 6.11675 2.45825 11.1794C2.45825 16.242 6.56231 20.346 11.6249 20.346Z"
            stroke="#005850"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.5116 7.29248L13.5683 13.1225L7.73828 15.0658L9.68161 9.23581L15.5116 7.29248Z"
            stroke="#005850"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
    {
      name: 'Explore',
      func: () => onChangePage(PageTypes.Explore),
      svg: (
        <svg
          width="22"
          height="23"
          viewBox="0 0 22 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.3334 19.4292V17.5959C18.3334 16.6234 17.9471 15.6908 17.2595 15.0031C16.5718 14.3155 15.6392 13.9292 14.6667 13.9292H7.33341C6.36095 13.9292 5.42832 14.3155 4.74069 15.0031C4.05306 15.6908 3.66675 16.6234 3.66675 17.5959V19.4292"
            stroke="#005850"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10.9999 10.2625C13.025 10.2625 14.6666 8.62091 14.6666 6.59587C14.6666 4.57082 13.025 2.9292 10.9999 2.9292C8.97487 2.9292 7.33325 4.57082 7.33325 6.59587C7.33325 8.62091 8.97487 10.2625 10.9999 10.2625Z"
            stroke="#005850"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
    {
      name: 'Profile',
      func: () => onClickUser(user.userId),
      svg: (
        <svg
          width="23"
          height="23"
          viewBox="0 0 23 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.375 8.42936L11.625 2.0127L19.875 8.42936V18.5127C19.875 18.9989 19.6818 19.4652 19.338 19.8091C18.9942 20.1529 18.5279 20.346 18.0417 20.346H5.20833C4.7221 20.346 4.25579 20.1529 3.91197 19.8091C3.56815 19.4652 3.375 18.9989 3.375 18.5127V8.42936Z"
            stroke="#005850"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8.875 20.3459V11.1792H14.375V20.3459"
            stroke="#005850"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
    {
      name: 'Search',
      func: () => onChangePage(PageTypes.Search),
      svg: (
        <svg
          width="17"
          height="17"
          viewBox="0 0 17 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.45833 12.8459C10.4039 12.8459 12.7917 10.4581 12.7917 7.51253C12.7917 4.56701 10.4039 2.1792 7.45833 2.1792C4.51281 2.1792 2.125 4.56701 2.125 7.51253C2.125 10.4581 4.51281 12.8459 7.45833 12.8459Z"
            stroke="#005850"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14.1251 14.1793L11.2251 11.2793"
            stroke="#005850"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
  ];
  return (
    <div className="flex h-[54px] bg-white   bottom-0 z-10 md:hidden fixed w-full">
      {menuTabs.map((tab) => (
        <div
          className={`w-1/4 flex flex-col justify-center items-center border-t-2 ${
            selectedTab === tab.name
              ? 'font-semibold bg-[#EBF2F1]  border-t-2 border-t-cym-darkteal'
              : 'border-cym-lightgrey'
          }`}
          onClick={() => {
            tab.func();
            setSelectedTab(tab.name);
          }}
        >
          <span className="w-[25px] h-[25px] flex justify-center items-center">{tab.svg}</span>
          <span className="text-cym-darkteal !text-xs">{tab.name}</span>
        </div>
      ))}
    </div>
  );
}

export default CustomFooterNav;
