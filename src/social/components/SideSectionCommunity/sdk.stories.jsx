import React from 'react';
import UiKitSideSectionCommunityComponent from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKSideSectionCommunity = ({ children }) => (
  <UiKitSideSectionCommunityComponent>{children}</UiKitSideSectionCommunityComponent>
);

SDKSideSectionCommunity.storyName = 'Community side section';

SDKSideSectionCommunity.args = {
  children: 'children slot',
};
