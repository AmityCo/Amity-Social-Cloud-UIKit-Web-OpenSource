import { notification } from 'components/Notification';

export const MAX_IMAGES = 10;
export const MAX_FILES = 10;

export const getAuthorId = ({ communityId, userId } = {}) => communityId || userId;

export const isIdenticalAuthor = (a, b) => !!getAuthorId(a) && getAuthorId(a) === getAuthorId(b);

export const maxImagesWarning = () =>
  notification.info({
    content: 'You reached the maximum attachment of 10',
  });

export const maxFilesWarning = () =>
  notification.info({
    content: 'The selected file is larger than 1GB. Please select a new file. ',
  });
