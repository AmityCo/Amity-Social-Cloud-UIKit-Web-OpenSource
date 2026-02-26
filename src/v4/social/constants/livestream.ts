type LiveStreamStatusObject = {
  [Key in `${Amity.StreamStatus}`]: Key;
};

export const liveStreamStatus: LiveStreamStatusObject = {
  idle: 'idle',
  live: 'live',
  ended: 'ended',
  recorded: 'recorded',
  error: 'error',
};
