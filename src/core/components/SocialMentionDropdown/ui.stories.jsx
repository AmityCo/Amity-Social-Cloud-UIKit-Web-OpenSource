import React from 'react';
import styled from 'styled-components';

import SocialMentionDropdown from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'UI Only',
};

const UiMentionDropdownContainer = styled.div`
  width: 400px;
  height: 200px;
`;

export const UiMentionDropdown = {
  render: () => {
    const [props] = useArgs();
    return (
      <UiMentionDropdownContainer>
        <SocialMentionDropdown {...props} />
      </UiMentionDropdownContainer>
    );
  },
};
