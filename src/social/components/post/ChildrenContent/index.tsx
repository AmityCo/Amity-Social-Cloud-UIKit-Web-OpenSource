import React, { ReactNode } from 'react';

import GalleryContent from '~/social/components/post/GalleryContent';
import FileListContent from '~/social/components/post/FileListContent';
import PollContent from '~/social/components/post/PollContent';

import * as StreamItem from '~/social/components/post/GalleryContent/StreamItem';
import * as VideoItem from '~/social/components/post/GalleryContent/VideoItem';
import { LivestreamRenderer } from './styles';

const dataTypes = ['image', 'video', 'file', 'poll', 'liveStream'];

const ChildrenContent = ({ contents }: { contents: Amity.Post[] }) => {
  // group children by renderable dataType
  const groups: Record<Amity.PostContentType, Amity.Post[]> = dataTypes
    .map((dataType) => contents.filter((content) => content.dataType === dataType))
    .filter((items) => items && !!items.length) // remove empty collections
    .reduce(
      (acc, items) => ({
        ...acc,
        [items[0].dataType]: items,
      }),
      {} as Record<Amity.PostContentType, Amity.Post[]>,
    ); // merge all

  if (!Object.keys(groups).length) return null;

  return (
    <>
      {Object.entries(groups).map(([dataType, items]) => {
        switch (dataType) {
          case 'image':
            return <GalleryContent key={dataType} items={items} truncate showCounter />;
          case 'video':
            return (
              <GalleryContent
                key={dataType}
                items={items}
                truncate
                showCounter
                renderVideoThumbnail={(item) => (
                  <VideoItem.Thumbnail item={item} showPlayIcon showVideoDuration />
                )}
              />
            );
          case 'file':
            return <FileListContent key={dataType} items={items} />;
          case 'poll':
            return (
              <>
                {items.map((poll) => (
                  <PollContent key={dataType} pollId={poll.data.pollId} />
                ))}
              </>
            );
          case 'liveStream':
            return (
              <LivestreamRenderer
                key={dataType}
                items={items}
                renderLiveStreamThumbnail={(item) => (
                  <StreamItem.Thumbnail item={item} showPlayIcon showLivestreamTitle />
                )}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default ChildrenContent;
