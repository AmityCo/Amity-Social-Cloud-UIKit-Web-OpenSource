export const generateThumbnailVideo = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const videoElement = document.createElement('video');
    const canvasElement = document.createElement('canvas');
    const context = canvasElement.getContext('2d');

    videoElement.src = URL.createObjectURL(file);
    videoElement.currentTime = 10;

    videoElement.addEventListener('loadeddata', () => {
      try {
        videoElement.pause();
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        context?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        const thumbnail = canvasElement.toDataURL('image/png');
        resolve(thumbnail);
      } catch (error) {
        reject(error);
      }
    });

    videoElement.addEventListener('error', (event) => {
      reject(new Error(`Error loading video: ${event.message}`));
    });
  });
};
