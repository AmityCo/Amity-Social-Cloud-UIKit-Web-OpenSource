import React from 'react';

import RecommendedList from '~/social/components/community/RecommendedList';
import TrendingList from '~/social/components/community/TrendingList';
import CategoriesCard from '~/social/components/category/CategoriesCard';

import { PageContainer } from './styles';
import {BackButton, Header, Title} from "~/social/pages/CategoryCommunities/styles";
import ArrowLeft from "~/icons/ArrowLeft";
import {PageTypes} from "~/social/constants";
import {useNavigation} from "~/social/providers/NavigationProvider";

const ExplorePage = () => {

    const { onBack, lastPage } = useNavigation();
    
    return (
        <PageContainer>
            <Header>
                <BackButton onClick={onBack}>
                    <ArrowLeft height={14} />
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
            <RecommendedList/>
            <TrendingList/>
            <CategoriesCard/>
        </PageContainer>
    );
};

export default ExplorePage;
