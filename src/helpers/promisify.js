const promisify = liveObject =>
  new Promise(resolve => liveObject.once('dataUpdated', () => resolve(liveObject.model)));

export default promisify;
