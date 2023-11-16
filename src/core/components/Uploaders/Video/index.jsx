import LocalVideo from './LocalVideo';
import DistantVideo from './DistantVideo';

export default (args) => {
  return 'file' in args && args.file instanceof File ? LocalVideo(args) : DistantVideo(args);
};
