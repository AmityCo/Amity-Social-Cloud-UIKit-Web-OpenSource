import React from 'react';

import HorizontalList from '~/core/components/HorizontalList';

const FeaturedVideos = () => {
  return (
    <div className="m-5">
      <h3>FeaturedVideos 🎥</h3>
      <div clasName="test-video">
        <video width="400" controls>
          <source
            src="https://cdn.shopify.com/videos/c/o/v/0b521038620f4e4cb7ce02784834a889.mp4"
            type="video/mp4"
          />
          Your browser does not support HTML video.
        </video>
      </div>
      <HorizontalList />
      <div className="overflow-hidden">
        <div className="grid grid-flow-col gap-[16px] max-w-[278px] min-h 289px">
          <div className="relative cover w-[200px] h-[315px] rounded-[5px] bg-slate-400 overflow-hidden">
            <h3 className="absolute m-[10px] bottom-0 w-full">Video Title</h3>
          </div>
          <div className="relative cover w-[200px] h-[315px] rounded-[5px] bg-slate-400 overflow-hidden">
            <h3 className="absolute m-[10px] bottom-0 w-full">Video Title</h3>
          </div>
          <div className="relative cover w-[200px] h-[315px] rounded-[5px] bg-slate-400 overflow-hidden">
            <h3 className="absolute m-[10px] bottom-0 w-full">Video Title</h3>
          </div>
          <div className="relative cover w-[200px] h-[315px] rounded-[5px] bg-slate-400 overflow-hidden">
            <h3 className="absolute m-[10px] bottom-0 w-full">Video Title</h3>
          </div>
          <div className="relative cover w-[200px] h-[315px] rounded-[5px] bg-slate-400 overflow-hidden">
            <h3 className="absolute m-[10px] bottom-0 w-full">Video Title</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedVideos;
