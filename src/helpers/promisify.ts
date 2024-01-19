/**
 *
 * @deprecated
 */
const promisify = (liveObject: any) =>
  new Promise((resolve, reject) => {
    liveObject.on('dataUpdated', (model: any) => {
      if (liveObject.loadingStatus === 'loaded') {
        liveObject.dispose();
        resolve(model);
      }
    });
    liveObject.once('dataError', (error: any) => {
      liveObject.dispose();
      reject(error);
    });
  });

export default promisify;
