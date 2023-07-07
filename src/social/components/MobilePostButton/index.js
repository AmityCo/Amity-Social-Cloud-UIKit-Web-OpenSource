import { React, memo } from 'react';
import styled from 'styled-components';

import customizableComponent from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';

import { PenToSquare } from '~/icons';

const Button = styled.div`
  position: fixed;
  z-index: 20;
  right: 10px;
  bottom: 15px;
  padding: 10px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  color: #fff;
  background-color: #005850;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  cursor: pointer;
  svg {
    width: 30px;
    height: 30px;
  }
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const spawnCreatePostModal = () => {
  document.getElementById('create-post-overlay').style.display = 'block';
  // document.getElementById('ApplicationContainer').style.overflowY = 'hidden';
  console.log('Clicked!');
};

const MobilePostButton = () => {
  return (
    <Button onClick={spawnCreatePostModal}>
      <PenToSquare />
    </Button>
  );
};

export default memo(withSDK(customizableComponent('MobilePostButton', MobilePostButton)));
