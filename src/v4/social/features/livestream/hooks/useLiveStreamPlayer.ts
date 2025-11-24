import { useCallback, useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
import Hls from 'hls.js';
import useSDK from '~/v4/core/hooks/useSDK';
import styles from '~/v4/social/features/livestream/pages/LiveStreamPlayerPage/components/LivestreamPlayer/LivestreamPlayer.module.css';

interface UseLiveStreamPlayerParams {
  post?: Amity.Post;
  room?: Amity.Room | null;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

export const useLiveStreamPlayer = ({ room, videoRef }: UseLiveStreamPlayerParams) => {
  const { client } = useSDK();
  const [muted, setMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isPoorConnection, setIsPoorConnection] = useState(false);
  const [playerInitialized, setPlayerInitialized] = useState(false);
  const [authorizedRecordedUrl, setAuthorizedRecordedUrl] = useState<string>('');
  const [videoReady, setVideoReady] = useState(false);

  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const plyrRef = useRef<Plyr | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const loadAuthorizedRecordedVideo = async (recordedUrl: string) => {
    if (!client) {
      console.warn('No client available for authorization');
      return recordedUrl;
    }

    try {
      const authToken = client.token?.accessToken;

      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      };

      // Add authorization header if token is available
      if (authToken) {
        (fetchOptions.headers as Record<string, string>).Authorization = `Bearer ${authToken}`;
      }

      // Fetch video with optional authorization headers
      const response = await fetch(recordedUrl, fetchOptions);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch recorded video: ${response.status} ${response.statusText}`,
        );
      }

      // Convert to blob and create object URL
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Clean up previous blob URL before setting new one
      setAuthorizedRecordedUrl((prevUrl) => {
        if (prevUrl && prevUrl.startsWith('blob:')) {
          URL.revokeObjectURL(prevUrl);
        }
        return blobUrl;
      });

      return blobUrl;
    } catch (error) {
      console.error('❌ Failed to load authorized recorded video:', error);

      return recordedUrl;
    }
  };

  const setupHlsForLiveVideo = (player: HTMLVideoElement, livePlaybackUrl: string) => {
    // Clean up existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const hls = new Hls({
      debug: false,
    });

    hlsRef.current = hls;

    // Add comprehensive error handling
    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error('❌ HLS Error Details:', {
        type: data.type,
        details: data.details,
        fatal: data.fatal,
        error: data.error,
        reason: data.reason,
        response: data.response,
        url: data.url,
        networkDetails: data.networkDetails,
        frag: data.frag,
      });

      // Handle fatal errors
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.error('🌐 Fatal network error - trying to recover');
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.error('🎬 Fatal media error - trying to recover');
            hls.recoverMediaError();
            break;
          default:
            console.error('💀 Fatal error - destroying HLS');
            hls.destroy();
            break;
        }
      }
    });

    hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      // Initialize Plyr for live videos only
      plyrRef.current = new Plyr(player, {
        controls: ['pause', 'play'],
        fullscreen: { enabled: false },
        clickToPlay: true,
      });
    });

    if (Hls.isSupported()) {
      hls.loadSource(livePlaybackUrl);
      hls.attachMedia(player);
    } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
      // Browser has native HLS support

      player.src = livePlaybackUrl;
    }
  };

  const initializePlayer = async () => {
    if (!videoRef?.current) {
      console.warn('useLiveStreamPlayer: videoRef is required');
      return;
    }

    const player = videoRef.current;

    // Clear any existing src to prevent conflicts
    player.src = '';

    // Clean up existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Clean up existing Plyr instance
    if (plyrRef.current) {
      plyrRef.current.destroy();
      plyrRef.current = null;
    }

    // Basic player setup
    player.muted = muted;
    player.autoplay = true;
    player.playsInline = true;
    player.setAttribute('playsinline', ''); // prevent fullscreen on iOS
    player.setAttribute('webkit-playsinline', '');

    player.onvolumechange = () => setMuted(!player.muted);

    player.classList.add(styles.liveStreamPlayer__video);
    player.setAttribute('data-is-live', room?.status === 'live' ? 'true' : 'false');

    // Add event listeners
    player.addEventListener('loadedmetadata', () => detectOrientation(player));
    player.addEventListener('loadeddata', () => detectOrientation(player));
    player.addEventListener('loadstart', handleLoadStart);
    player.addEventListener('waiting', handleWaiting);
    player.addEventListener('playing', handlePlaying);
    player.addEventListener('canplay', handleCanPlay);

    // Handle video source based on room status
    if (room?.status === 'live' && room?.livePlaybackUrl) {
      // Setup for live video - with Plyr controls and HLS

      player.controls = false;
      setupHlsForLiveVideo(player, room.livePlaybackUrl);
    } else if (room?.status === 'recorded') {
      // Setup for recorded video - with native controls, no Plyr
      player.controls = true;
      const recordedUrl = room?.recordedPlaybackInfos?.[0]?.url;
      if (recordedUrl) {
        const authorizedUrl = await loadAuthorizedRecordedVideo(recordedUrl);
        player.src = authorizedUrl;
      }
    }

    setPlayerInitialized(true);
  };

  const detectOrientation = (player: HTMLVideoElement) => {
    const orientation = player.videoHeight > player.videoWidth ? 'portrait' : 'landscape';
    player.setAttribute('data-orientation', orientation);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleWaiting = () => {
    setIsLoading(true);
    setIsPoorConnection(true);
  };

  const handlePlaying = () => {
    clearTimeout(loadingTimerRef.current!);
    setIsLoading(false);
    setIsPoorConnection(false);
  };

  const handleCanPlay = () => {
    clearTimeout(loadingTimerRef.current!);
    setIsLoading(false);
    setIsPoorConnection(false);
  };

  const resetLiveStreamPlayerRef = () => {
    if (videoRef?.current) {
      // Reset video element state
      const video = videoRef.current;
      video.pause();
      video.currentTime = 0;
      video.src = '';
    }
  };

  const reloadPlayer = useCallback(() => {
    if (!videoRef?.current) {
      // Set a flag to reload when video becomes ready
      setVideoReady(false);
      return;
    }

    const video = videoRef.current;

    // Clean up existing player
    if (plyrRef.current) {
      plyrRef.current.destroy();
      plyrRef.current = null;
    }

    // Clean up existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Remove existing event listeners
    video.removeEventListener('loadedmetadata', () => detectOrientation(video));
    video.removeEventListener('loadeddata', () => detectOrientation(video));
    video.removeEventListener('loadstart', handleLoadStart);
    video.removeEventListener('waiting', handleWaiting);
    video.removeEventListener('playing', handlePlaying);
    video.removeEventListener('canplay', handleCanPlay);

    // Reset video state
    video.pause();
    video.currentTime = 0;
    video.src = '';

    // Reset component state
    setIsLoading(true);
    setIsPoorConnection(false);
    setPlayerInitialized(false);

    // Clean up blob URLs
    if (authorizedRecordedUrl && authorizedRecordedUrl.startsWith('blob:')) {
      URL.revokeObjectURL(authorizedRecordedUrl);
      setAuthorizedRecordedUrl('');
    }

    // Clear any pending timers
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }

    // Reinitialize after a brief delay to ensure cleanup is complete
    setTimeout(() => {
      initializePlayer();
    }, 100);
  }, [videoRef, room?.status, muted, room?.livePlaybackUrl, room?.recordedPlaybackInfos]);

  useEffect(() => {
    if (videoRef?.current) {
      initializePlayer();
    }

    return () => {
      const currentVideo = videoRef?.current;
      if (currentVideo) {
        currentVideo.removeEventListener('loadedmetadata', () => detectOrientation(currentVideo));
        currentVideo.removeEventListener('loadeddata', () => detectOrientation(currentVideo));
        currentVideo.removeEventListener('loadstart', handleLoadStart);
        currentVideo.removeEventListener('waiting', handleWaiting);
        currentVideo.removeEventListener('playing', handlePlaying);
        currentVideo.removeEventListener('canplay', handleCanPlay);
        currentVideo.removeEventListener('canplaythrough', handleCanPlay);
        currentVideo.removeEventListener('progress', handleCanPlay);
      }
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      if (plyrRef.current) {
        plyrRef.current.destroy();
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      // Clean up blob URLs
      if (authorizedRecordedUrl && authorizedRecordedUrl.startsWith('blob:')) {
        URL.revokeObjectURL(authorizedRecordedUrl);
      }
    };
  }, [
    videoRef?.current,
    room?.status,
    room?.livePlaybackUrl,
    room?.recordedPlaybackInfos?.[0]?.url,
  ]);

  useEffect(() => {
    const checkVideo = () => {
      if (videoRef?.current && !videoReady) {
        setVideoReady(true);
      } else if (!videoRef?.current && videoReady) {
        setVideoReady(false);
      }
    };

    checkVideo();
    // Check periodically in case we miss the initial mount
    const interval = setInterval(checkVideo, 50);

    return () => clearInterval(interval);
  }, [videoRef?.current, videoReady]);

  useEffect(() => {
    if (videoReady && videoRef?.current) {
      initializePlayer();
    }
  }, [videoReady]);

  return {
    isLoading,
    isPoorConnection,
    playerInitialized,
    plyrContainer: plyrRef.current?.elements?.container,
    resetLiveStreamPlayerRef,
    reloadPlayer,
    setVideoReady,
  };
};
