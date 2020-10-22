import LocalImage from './LocalImage';
import DistantImage from './DistantImage';

export default args => {
  return 'file' in args && args.file instanceof File ? LocalImage(args) : DistantImage(args);
};
