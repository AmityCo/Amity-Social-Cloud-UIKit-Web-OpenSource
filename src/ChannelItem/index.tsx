import React, { useState, useEffect } from 'react';

import { customizableComponent } from '../hoks/customization';

import { ChannelItemContainer } from './styles';

const ChannelItem = ({ channelId, selected, onSelect }) => (
  <ChannelItemContainer onClick={() => onSelect(channelId)} selected={selected}>
    {channelId}
  </ChannelItemContainer>
);

export default customizableComponent('ChannelItem')(ChannelItem);
