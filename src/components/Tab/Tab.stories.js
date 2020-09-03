import React from 'react';
import Tab from '.';

export default {
  title: 'Tab',
};

export const Default = () => <Tab>Tab text</Tab>;

export const Active = () => <Tab active>Tab text</Tab>;

export const Tabs = () => (
  <div>
    <Tab active>Active Tab</Tab> <Tab>Just Tab</Tab>
  </div>
);
