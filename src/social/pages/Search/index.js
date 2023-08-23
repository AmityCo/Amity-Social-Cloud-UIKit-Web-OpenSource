import React, {forwardRef} from 'react';

import {Wrapper} from './styles';
import PropTypes from "prop-types";
import styled from "styled-components";
import CommunitySideMenu from "~/social/components/CommunitySideMenu";

const StyledCommunitySideMenu = styled(CommunitySideMenu)`
  min-height: 100%;
`;

const Search = forwardRef(
    (
        {
            isLandingPage
        },
        ref,
    ) => {
        return (
            <Wrapper>
                <StyledCommunitySideMenu />
            </Wrapper>
        );
    },
);

Search.propTypes = {
    isLandingPage: PropTypes.string
};

export default Search;