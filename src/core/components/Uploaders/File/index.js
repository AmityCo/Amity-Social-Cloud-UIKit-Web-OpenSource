import LocalFile from './LocalFile';
import DistantFile from './DistantFile';

export default args => {
  return 'file' in args && args.file instanceof File ? LocalFile(args) : DistantFile(args);
};
