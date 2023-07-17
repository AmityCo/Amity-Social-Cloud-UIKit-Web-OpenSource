import PropTypes from 'prop-types';
import { memo, useState } from 'react';

import customizableComponent from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';

import useUser from '~/core/hooks/useUser';
import { backgroundImage as UserImage } from '~/icons/User';
import Avatar from '../Avatar';

import UiKitSocialSearch from '~/social/components/SocialSearch';
import { PageTypes, userId } from '~/social/constants';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { CustomHeaderWrapper, SearchWrapper } from './styles';

const CustomHeader = ({ onClickUser, className }) => {
  // const userId = window.shopifyCustomerId;
  const { user, file } = useUser(userId);
  const { onChangePage, page } = useNavigation();

  const menuTabs = [
    { name: 'Profile', func: () => onClickUser(user.userId) },
    { name: 'News Feed', func: () => onChangePage(PageTypes.NewsFeed) },
    { name: 'Explore', func: () => onChangePage(PageTypes.Explore) },
    { name: 'My Groups', func: () => onChangePage(PageTypes.MyGroups) },
  ];

  const [showMenu, setShowMenu] = useState(false);

  const searchWrapper = document.getElementById('search-wrapper');
  const mainContainer = document.getElementById('main-container');
  const searchMenuItem = document.querySelector('.search-menu-item');
  // const searchMenuItem = document.querySelector('search-menu-item');

  function showMobileSearch() {
    searchWrapper.style.display = 'block';
  }

  function hideMobileSearch() {
    searchWrapper.style.display = 'none';
  }

  document.addEventListener('keydown', function (event) {
    if (event.keyCode === 13 || event.which === 13) {
      // Key code 13 corresponds to the Enter key
      // You can replace the following line with your own function call
      hideMobileSearch();
    }
  });
  if (searchMenuItem) {
    searchMenuItem.addEventListener('click', function () {
      hideMobileSearch();
    });
  }
  if (mainContainer) {
    mainContainer.addEventListener('click', function () {
      hideMobileSearch();
    });
  }

  return (
    <CustomHeaderWrapper
      className={`${className ?? ''} fixed border-cym-lightgrey  bg-cym-lightteal`}
    >
      <div className="flex flex-col w-full border-y-1  gap-3  px-5 md:px-[68px] py-[16px]">
        <div className="flex flex-row items-end">
          <svg
            className="ml-[-8px] w-[100px] md:w-[140px]"
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 463.83 103.16"
          >
            <defs>
              <style>{`.cls-1{fill:#005850;}`}</style>
            </defs>
            <g>
              <path
                className="cls-1"
                d="M115.02,71.42H48.69l-15.41,27.74h-7.77L78.04,5.36h7.77l52.53,93.8h-7.77l-15.54-27.74Zm-3.48-6.43L81.79,11.79l-29.62,53.2h59.36Z"
              />
              <path
                className="cls-1"
                d="M159.11,99.16V26.39h6.83v19.16c5.76-12.73,21.31-20.37,37.65-20.37v6.16c-16.75,0-31.62,7.64-37.65,22.92v44.89h-6.83Z"
              />
              <path
                className="cls-1"
                d="M221.95,8.97c0-2.95,2.41-5.09,5.63-5.09s5.49,2.14,5.49,5.09-2.28,5.23-5.49,5.23-5.63-2.28-5.63-5.23Zm9.11,90.18h-6.83V26.39h6.83V99.16Z"
              />
              <path
                className="cls-1"
                d="M334.51,79.06c0,12.73-13,22.92-37.52,22.92-17.29,0-31.76-6.03-41.27-16.21l4.69-4.02c8.71,9.38,20.9,14.34,36.72,14.34,18.89,0,30.55-6.57,30.55-16.48s-12.33-13.27-32.43-15.14c-18.89-1.61-36.72-5.36-36.72-19.56s16.62-21.17,36.45-21.17c15.28,0,27.74,5.63,35.24,12.6l-4.56,4.56c-7.1-6.97-17.29-11.26-30.95-11.39-13-.13-29.35,4.29-29.35,15.14,0,10.18,15.01,12.6,32.03,13.94,21.71,1.88,37.12,6.97,37.12,20.5Z"
              />
              <path
                className="cls-1"
                d="M438.23,61.64c0,.67,0,1.07-.13,1.34h-77.86c0,21.57,14.34,32.96,36.58,32.96,15.54,0,25.59-3.75,34.44-12.19l4.56,4.82c-9.92,9.25-21.71,13.4-39.26,13.4-27.47,0-43.28-15.41-43.28-39.13s15.81-39.13,43.01-39.13,41.54,14.2,41.94,37.92Zm-77.72-4.42h70.75c-2.55-18.49-15.81-27.61-34.98-27.61s-33.5,9.65-35.78,27.61Z"
              />
            </g>
            <g>
              <path
                className="cls-1"
                d="M440.87,6.75h-4.1v-1.94h10.49v1.94h-4.1v10.41h-2.29V6.75Z"
              />
              <path
                className="cls-1"
                d="M460.87,17.17l-.02-8.19-4.06,6.78h-1.02l-4.06-6.67v8.09h-2.19V4.81h1.89l4.91,8.19,4.82-8.19h1.89l.02,12.36h-2.17Z"
              />
            </g>
          </svg>

          <div className="text-cym-teal uppercase cym-h-2 !leading-none ml-2">COMMUNITY</div>

          <div className="flex ml-auto gap-5 items-center">
            <div className="relative">
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-[6px] py-[2px] !text-[10px] font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                7
              </span>
              <svg
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[16px] h-[16px]"
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
            </div>
            {/* <button type="button" className="relative md:hidden" onClick={showMobileSearch}>
              <Search className="w-[16px] h-7" id="search-button" />
            </button> */}
            <div className="hidden md:block">
              <Avatar
                data-qa-anchor="header-avatar"
                avatar={file.fileUrl}
                backgroundImage={UserImage}
                onClick={() => onClickUser(user.userId)} // add functionallity that directs to profile page on click.
              />
            </div>

            <p
              onClick={() => onClickUser(user.userId)} // add functionallity that directs to profile page on click.
              className="xs:cym-p-1-sm md:cym-p-1 xl:cym-p-1-lg hidden md:block cursor-pointer"
              data-qa-anchor="user-info-profile-name"
            >
              {user.displayName}
            </p>

            {/* <div className="relative">
              <EllipsisH
                onClick={() => setShowMenu(!showMenu)}
                className="md:hidden w-[16px] h-7"
              />
              {showMenu && (
                <>
                  <div
                    onClick={() => setShowMenu(false)}
                    className="fixed inset-0 bg-black opacity-40 w-full h-full z-50"
                  ></div>
                  <div className="shadow-custom absolute right-0 w-[140px] bg-white flex flex-col z-50 cym-h-2-sm justify-center border-[0.5px] border-cym-grey rounded-md animate-fade-in">
                    {menuTabs.map((tab, index) => (
                      <p
                        onClick={() => {
                          tab.func();
                          setShowMenu(false);
                        }}
                        className={`p-[10px] flex items-center ${
                          index + 1 < menuTabs.length ? 'border-b-[0.5px] border-cym-grey' : ''
                        }`}
                      >
                        {tab.name}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div> */}
          </div>
        </div>

        <div className="cym-h-2 hidden md:block mb-[18px]">
          Ask questions, join challenges, and find support as you embark on your wellness journey.
        </div>
      </div>
      <SearchWrapper id="search-wrapper">
        <UiKitSocialSearch />
      </SearchWrapper>
    </CustomHeaderWrapper>
  );
};

CustomHeader.propTypes = {
  onClickUser: PropTypes.func,
};
CustomHeader.defaultProps = {
  onClickUser: null,
};

export default memo(withSDK(customizableComponent('CustomHeader', CustomHeader)));
