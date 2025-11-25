import { forwardRef, useState } from 'react';
import { FileRepository } from '@amityco/ts-sdk';
import eventThumbnail from '~/v4/social/assets/images/event-default-thumbnail.png';
import styles from './EventCover.module.css';

type EventCoverProps = {
  url?: string;
};

export const EventCover = forwardRef<HTMLDivElement, EventCoverProps>(({ url }, ref) => {
  const [errorImage, setErrorImage] = useState(false);

  return (
    <div className={styles.eventCover} ref={ref}>
      <img
        alt="Event cover"
        onError={() => setErrorImage(true)}
        className={styles.eventCover__image}
        src={
          errorImage
            ? eventThumbnail
            : url
              ? FileRepository.fileUrlWithSize(url, 'medium')
              : eventThumbnail
        }
      />
    </div>
  );
});
