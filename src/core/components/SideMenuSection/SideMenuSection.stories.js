import React from 'react';
import SideMenuSection from '.';

export default {
  title: 'Components/SideMenu/Section',
  parameters: { layout: 'centered' },
};

export const Basic = ({ heading, children }) => (
  <SideMenuSection heading={heading}>{children}</SideMenuSection>
);

Basic.args = {
  heading: 'Section heading',
  children: 'children slot',
};

Basic.argTypes = {
  heading: { control: { type: 'text' } },
  children: { control: { type: 'text' } },
};
