import { AmityUserTokenManager, ApiRegion } from '@amityco/js-sdk';
import { apiKey, userId } from '~/social/constants';
const REWARDS_BASE_URL =
  'https://cym-hachiko-rest-py.herokuapp.com/api/v1/rewards?logged_in_customer_id=';
const REWARDS_SHOP_ID = '&shop_id=1';

const ServerAPI = () => {
  async function getAccessToken() {
    const { accessToken, err } = await AmityUserTokenManager.createUserToken(apiKey, ApiRegion.US, {
      userId: userId,
    });
    return accessToken;
  }

  //////////////////////////////// ARISE CALLS //////////////////////////////////////////
  const ariseGetRewards = async (ariseUserId) => {
    try {
      const response = await fetch(`${REWARDS_BASE_URL} + ${ariseUserId} + ${REWARDS_SHOP_ID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error: ', response.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////// NOTIFICATION CALLS //////////////////////////////////////////

  const getNotifications = async () => {
    const url = 'https://beta.amity.services/notifications/v2/history';

    try {
      const accessToken = await getAccessToken();

      const response = await fetch(url, {
        method: 'GET',

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error.message);
      return null;
    }
  };

  const setReadNotification = async (body) => {
    const url = 'https://beta.amity.services/notifications/v2/read';

    try {
      const accessToken = await getAccessToken();

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ verb: body.verb, targetId: body.targetId }),
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error.message);
      return null;
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////////

  return {
    ariseGetRewards,
    getNotifications,
    setReadNotification,
  };
};

export default ServerAPI;
