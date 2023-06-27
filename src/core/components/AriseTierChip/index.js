import React from 'react';
import useUser from '~/core/hooks/useUser';

const AriseTierChip = () => {
  // const userId = window.shopifyCustomerId;
  const userId = '3454838145071';
  const { user } = useUser(userId);
  const ariseTier = user?.metadata?.ariseTier;

  return (
    <span className="whitespace-nowrap rounded-full bg-[#EBF2F1] px-2.5 py-0.5 text-sm uppercase font-mon font-bold text-[#222222]">
      {ariseTier}
    </span>
  );
};

export default AriseTierChip;
