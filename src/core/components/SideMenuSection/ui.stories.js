import React from 'react';

import UiKitSideMenuSection from '.';

export default {
  title: 'Ui Only/Side Menu',
};

export const Section = (props) => <UiKitSideMenuSection {...props} />;

Section.args = {
  heading: 'Section heading',
  children: 'children slot',
};

Section.argTypes = {
  heading: { control: { type: 'text' } },
  children: { control: { type: 'text' } },
};
