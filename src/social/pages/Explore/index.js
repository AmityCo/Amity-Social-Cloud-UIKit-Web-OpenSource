import React, {forwardRef} from 'react';

import RecommendedList from '~/social/components/community/RecommendedList';
import TrendingList from '~/social/components/community/TrendingList';
import CategoriesCard from '~/social/components/category/CategoriesCard';

import {PageContainer} from './styles';
import {BackButton, Header, Title} from "~/social/pages/CategoryCommunities/styles";
import ArrowLeft from "~/icons/ArrowLeft";
import {PageTypes} from "~/social/constants";
import {useNavigation} from "~/social/providers/NavigationProvider";
import PropTypes from "prop-types";
import NewsFeed from "~/social/pages/NewsFeed";

const ExplorePage = forwardRef(
    (
        {
            isLandingPage,
        },
        ref,
    ) => {

        const {onBack, lastPage} = useNavigation();

        return (
            <PageContainer>
                {!isLandingPage && (
                    <Header>
                        <BackButton onClick={onBack}>
                            <ArrowLeft height={14}/>
                        </BackButton>

                        {lastPage.type === PageTypes.NewsFeed && (
                            <Title>{"Main Feed"}</Title>
                        )}

                        {lastPage.type === PageTypes.Search && (
                            <Title>{"Search & Communities"}</Title>
                        )}

                        {lastPage.type === PageTypes.UserFeed && (
                            <Title>{"User Feed"}</Title>
                        )}

                        {lastPage.type === PageTypes.CommunityFeed && (
                            <Title>{"Community Feed"}</Title>
                        )}

                    </Header>
                )}
                
                <RecommendedList/>
                <TrendingList/>
                <CategoriesCard/>
            </PageContainer>
        );
    },
);

ExplorePage.propTypes = {
    isLandingPage: PropTypes.string
};

export default ExplorePage;
