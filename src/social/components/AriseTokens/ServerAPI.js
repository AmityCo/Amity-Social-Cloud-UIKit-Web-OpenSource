import axios from 'axios';

const REWARDS_BASE_URL =
  'https://cym-hachiko-rest-py.herokuapp.com/api/v1/rewards?logged_in_customer_id=3454838145071&shop_id=1';

class ServerAPI {
  async ariseGetRewards() {
    this.res = await axios({
      method: 'GET',
      url: `${REWARDS_BASE_URL}`,
    });

    return this.res;
  }
}

export default ServerAPI;
