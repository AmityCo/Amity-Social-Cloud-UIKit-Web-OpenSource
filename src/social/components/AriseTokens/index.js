import React, { memo } from 'react';
import useUser from '~/core/hooks/useUser';
// import EmptyState from '~/core/components/EmptyState';
import customizableComponent from '~/core/hocs/customization';

import { AriseTokensContainer } from './styles';

const AriseTokensGallery = () => {
  // const userId = window.shopifyCustomerId;
  const userId = '3454838145071'; // remove on build
  const { user } = useUser(userId);

  return (
    <>
      {/* 
      <h1>
        Arise Tokens for:
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </h1>
       */}
      <AriseTokensContainer className="grid grid-cols-2 md:grid-cols-3 gap-[32px] items-center">
        <div className="m-auto w-[140px] h-[140px] rounded-[100px] bg-gray-500"></div>
        <div className="m-auto w-[140px] h-[140px] rounded-[100px] bg-gray-500"></div>
        <div className="m-auto w-[140px] h-[140px] rounded-[100px] bg-gray-500"></div>
        <div className="m-auto w-[140px] h-[140px] rounded-[100px] bg-gray-500"></div>
        <div className="m-auto w-[140px] h-[140px] rounded-[100px] bg-gray-500"></div>
      </AriseTokensContainer>
    </>
  );
};

export default memo(customizableComponent('AriseTokensGallery', AriseTokensGallery));
