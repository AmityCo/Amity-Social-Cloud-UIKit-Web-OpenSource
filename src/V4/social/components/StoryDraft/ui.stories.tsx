import React from 'react';

import styled from 'styled-components';
import { StoryDraft } from '.';

export default {
  title: 'Ui Only/Social/Story',
};

const MobileContainer = styled.div`
  width: 360px;
  height: 640px;
`;

export const UiStoryDraft = {
  name: 'Draft Story',
  render: () => {
    {
      return (
        <MobileContainer>
          <StoryDraft
            imageSrc="https://picsum.photos/300/300"
            creatorAvatar="https://picsum.photos/300/300"
          />
        </MobileContainer>
      );
    }
  },
};
