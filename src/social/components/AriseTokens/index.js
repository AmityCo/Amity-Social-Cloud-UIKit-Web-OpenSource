import React, { memo, useEffect, useState } from 'react';

// import EmptyState from '~/core/components/EmptyState';
import customizableComponent from '~/core/hocs/customization';
import { AriseTokensContainer } from './styles';
import EmptyState from '~/core/components/EmptyState';

import ServerAPI from '../../pages/Application/ServerAPI';

const AriseTokensGallery = ({ targetId }) => {
  const [loading, setLoading] = useState(true);
  const [extractedRewardsData, setExtractedRewardsData] = useState([]);
  const server = ServerAPI();
  useEffect(() => {
    if (targetId) {
      const ariseResp = async () => {
        const ariseUserId = targetId;
        try {
          // pass targetId to ServerAPI Wrapper
          const ariseRewardsResp = await server.ariseGetRewards(ariseUserId);
          const ariseRewardsData = ariseRewardsResp.rewards;

          const extractedData = ariseRewardsData
            .filter((reward) => reward.reward.name !== 'Birthday Gift')
            .map((reward) => {
              const {
                claimedNft,
                reward: { name, assets },
              } = reward;
              const { publicUrl } = assets.length ? assets[0] : '';

              return {
                claimedNft,
                name,
                publicUrl,
              };
            });

          setExtractedRewardsData(extractedData);
          setLoading(false);

          console.log('Your extracted data', extractedData);
        } catch (error) {
          console.error('Error fetching Rewards data:', error);
        }
      };

      ariseResp();
    }
  }, [targetId]);

  return (
    <AriseTokensContainer className="grid grid-cols-3 gap-[32px] items-start mx-auto">
      {loading ? (
        <div>Loading</div>
      ) : (
        extractedRewardsData && extractedRewardsData.length > 0 ? (
          extractedRewardsData.map((reward, index) =>
            reward.claimedNft ? (
              <div key={index} className="mx-auto w-[75px] md:w-[140px] text-center">
                <div
                  className="mb-[16px] h-[75px]  md:h-[140px] rounded-[100px]"
                  style={{
                    backgroundImage: `url(${reward.publicUrl})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                  }}
                />
                <h3 className="text-[14px] font-semibold">{reward.name}</h3>
              </div>
            ) : null
          )
        ) : (
          <EmptyState />
        )
      )}
    </AriseTokensContainer>
  );
};

export default memo(customizableComponent('AriseTokensGallery', AriseTokensGallery));
