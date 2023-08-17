import React, {forwardRef} from 'react';
import styled from 'styled-components';

import {PageTypes} from '~/social/constants';

import MainLayout from '~/social/layouts/Main';

import CommunitySideMenu from '~/social/components/CommunitySideMenu';

import ExplorePage from '~/social/pages/Explore';
import NewsFeedPage from '~/social/pages/NewsFeed';
import CommunityFeedPage from '~/social/pages/CommunityFeed';
import UserFeedPage from '~/social/pages/UserFeed';
import CategoryCommunitiesPage from '~/social/pages/CategoryCommunities';
import CommunityEditPage from '~/social/pages/CommunityEdit';
import ProfileSettings from '~/social/components/ProfileSettings';
import {useNavigation} from '~/social/providers/NavigationProvider';
import SideSectionCommunity from '~/social/components/SideSectionCommunity';
import SideSectionMyCommunity from '~/social/components/SideSectionMyCommunity';
import UiKitSocialSearch from '~/social/components/SocialSearch';
import PropTypes from "prop-types";
import UiKitProvider from "~/core/providers/UiKitProvider";

const ApplicationContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const StyledCommunitySideMenu = styled(CommunitySideMenu)`
  min-height: 100%;
`;

const SocialSearch = styled(UiKitSocialSearch)`
  background: ${({theme}) => theme.palette.system.background};
  padding: 0.5rem;
`;
var hasLanded = false;

const Community = forwardRef(
    (
        {
            landingPage
        },
        ref,
    ) => {
        const {page, lastPage, onChangePage} = useNavigation(landingPage);

        if (landingPage && !hasLanded && landingPage !== PageTypes.NewsFeed) {
            hasLanded = true;
            onChangePage(landingPage);
        }
        else
        {
            hasLanded = true;
        }

        return (
            <ApplicationContainer>
                <MainLayout>
                    {page.type === PageTypes.Explore && <ExplorePage isLandingPage={landingPage && 
                        lastPage.type === PageTypes.NewsFeed && landingPage === PageTypes.Explore}/>}

                    {page.type === PageTypes.NewsFeed && <NewsFeedPage isLandingPage={landingPage && 
                        landingPage !== PageTypes.NewsFeed}/>}

                    {page.type === PageTypes.CommunityFeed && (
                        <CommunityFeedPage communityId={page.communityId} isNewCommunity={page.isNewCommunity}/>
                    )}

                    {page.type === PageTypes.CommunityEdit && (
                        <CommunityEditPage communityId={page.communityId} tab={page.tab}/>
                    )}

                    {page.type === PageTypes.Category && (
                        <CategoryCommunitiesPage categoryId={page.categoryId}/>
                    )}

                    {page.type === PageTypes.UserFeed && <UserFeedPage userId={page.userId}/>}

                    {page.type === PageTypes.UserEdit && <ProfileSettings userId={page.userId}/>}
                </MainLayout>
            </ApplicationContainer>
        );
    },
);

Community.propTypes = {
    landingPage: PropTypes.string
};

export default Community;
