const promisify = liveObject =>
  new Promise((resolve, reject) => {
    liveObject.once('dataUpdated', () => {
      resolve(liveObject.model);
      liveObject.dispose();
    });
    liveObject.once('dataError', error => {
      reject(error);
      liveObject.dispose();
    });
  });

export default promisify;
