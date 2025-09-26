export const generateThumbnailVideo = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const videoElement = document.createElement('video');
    const canvasElement = document.createElement('canvas');
    const context = canvasElement.getContext('2d');

    videoElement.src = URL.createObjectURL(file);

    const handleCanPlay = () => {
      videoElement.currentTime = 10;
    };

    const handleSeeked = () => {
      try {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        context?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        const thumbnail = canvasElement.toDataURL('image/png');
        resolve(thumbnail);
      } catch (error) {
        reject(error);
      } finally {
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('seeked', handleSeeked);
        videoElement.removeEventListener('error', handleError);
        URL.revokeObjectURL(videoElement.src);
      }
    };

    const handleError = (event: Event) => {
      reject(new Error(`Error loading video: ${event}`));
    };

    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('seeked', handleSeeked);
    videoElement.addEventListener('error', handleError);

    videoElement.load();
  });
};
