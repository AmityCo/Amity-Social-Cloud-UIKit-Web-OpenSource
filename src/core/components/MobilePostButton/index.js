import { React, memo } from 'react';
import styled from 'styled-components';

import customizableComponent from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';

import { PenToSquare } from '~/icons';

const Button = styled.div`
  padding: 10px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  color: #fff;
  background-color: #005850;

  svg {
    width: 30px;
    height: 30px;
  }
`;

const MobilePostButton = () => {
  return (
    <Button>
      <PenToSquare />
    </Button>
  );
};

export default memo(withSDK(customizableComponent('MobilePostButton', MobilePostButton)));
