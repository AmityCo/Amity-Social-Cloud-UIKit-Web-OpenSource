import React, { useState, memo, useEffect } from 'react';

// import EmptyState from '~/core/components/EmptyState';
import customizableComponent from '~/core/hocs/customization';
import { AriseTokensContainer } from './styles';

import ServerAPI from './ServerAPI';

const AriseTokensGallery = ({ targetId }) => {
  const [extractedRewardsData, setExtractedRewardsData] = useState([]);

  useEffect(() => {
    if (targetId) {
      const ariseResp = async () => {
        const ariseUserId = targetId;
        try {
          const server = new ServerAPI();

          // pass targetId to ServerAPI Wrapper
          const ariseRewardsResp = await server.ariseGetRewards(ariseUserId);
          const ariseRewardsData = ariseRewardsResp.rewards;

          const extractedData = ariseRewardsData.map((reward) => {
            const {
              claimedNft,
              reward: { name, assets },
            } = reward;
            const { publicUrl } = assets[0];

            return {
              claimedNft,
              name,
              publicUrl,
            };
          });

          setExtractedRewardsData(extractedData);

          console.log('Your extracted data', extractedData);
        } catch (error) {
          console.error('Error fetching Rewards data:', error);
        }
      };

      ariseResp();
    }
  }, [targetId]);

  return (
    <AriseTokensContainer className="grid grid-cols-3 gap-[32px] items-center">
      {extractedRewardsData?.map((reward, index) =>
        reward.claimedNft ? (
          <div key={index} className="text-center">
            <div
              className="m-auto mb-[16px] w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-[100px]"
              style={{
                backgroundImage: `url(${reward.publicUrl})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
              }}
            />
            <h3 className="text-[14px] font-semibold">{reward.name}</h3>
          </div>
        ) : null,
      )}
    </AriseTokensContainer>
  );
};

export default memo(customizableComponent('AriseTokensGallery', AriseTokensGallery));
