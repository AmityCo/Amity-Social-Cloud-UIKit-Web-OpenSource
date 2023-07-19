const REWARDS_BASE_URL =
  'https://cym-hachiko-rest-py.herokuapp.com/api/v1/rewards?logged_in_customer_id=';
const REWARDS_SHOP_ID = '&shop_id=1';
class ServerAPI {
  ariseGetRewards = async (ariseUserId) => {
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

  getNotifications = async (token) => {
    const url = 'https://beta.amity.services/notifications/v2/history';

    try {
      const response = await fetch(url, {
        method: 'GET',

        headers: {
          Authorization: `Bearer ${token}`,
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

  setReadNotification = async (token, body) => {
    const url = 'https://beta.amity.services/notifications/v2/read';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
}

export default ServerAPI;
