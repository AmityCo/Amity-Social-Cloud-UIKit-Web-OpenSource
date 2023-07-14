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
}

export default ServerAPI;
