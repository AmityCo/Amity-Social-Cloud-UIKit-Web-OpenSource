import { LoadingStatus } from '@amityco/js-sdk';

const promisify = (liveObject) =>
  new Promise((resolve, reject) => {
    liveObject.on('dataUpdated', (model) => {
      if (liveObject.loadingStatus === LoadingStatus.Loaded) {
        liveObject.dispose();
        resolve(model);
      }
    });
    liveObject.once('dataError', (error) => {
      liveObject.dispose();
      reject(error);
    });
  });

export default promisify;
