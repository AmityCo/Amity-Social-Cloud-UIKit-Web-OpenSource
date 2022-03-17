import React from 'react';
import styled from 'styled-components';

import SocialMentionDropdown from '.';

export default {
  title: 'UI Only',
};

const UiMentionDropdownContainer = styled.div`
  width: 400px;
  height: 200px;
`;

export const UiMentionDropdown = (props) => (
  <UiMentionDropdownContainer>
    <SocialMentionDropdown {...props} />
  </UiMentionDropdownContainer>
);
