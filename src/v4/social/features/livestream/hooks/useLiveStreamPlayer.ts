import { useCallback, useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
import Hls from 'hls.js';
import useSDK from '~/v4/core/hooks/useSDK';
import styles from '~/v4/social/features/livestream/pages/LiveStreamPlayerPage/components/LivestreamPlayer/LivestreamPlayer.module.css';
import { VIDEO_CONTROLS_AUTO_HIDE_MS } from '~/v4/social/constants';

interface UseLiveStreamPlayerParams {
  post?: Amity.Post;
  room?: Amity.Room | null;
  videoRef?: React.RefObject<HTMLVideoElement>;
  controlsAutoHideMs?: number;
}

export const useLiveStreamPlayer = ({
  room,
  videoRef,
  controlsAutoHideMs,
}: UseLiveStreamPlayerParams) => {
  const { client } = useSDK();
  const [muted, setMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isPoorConnection, setIsPoorConnection] = useState(false);
  const [playerInitialized, setPlayerInitialized] = useState(false);
  const [authorizedRecordedUrl, setAuthorizedRecordedUrl] = useState<string>('');
  const [videoReady, setVideoReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controlsHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const plyrRef = useRef<Plyr | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const CONTROLS_AUTO_HIDE_MS = controlsAutoHideMs ?? VIDEO_CONTROLS_AUTO_HIDE_MS;

  const scheduleHideControls = useCallback(() => {
    if (controlsHideTimerRef.current) clearTimeout(controlsHideTimerRef.current);
    controlsHideTimerRef.current = setTimeout(() => setShowControls(false), CONTROLS_AUTO_HIDE_MS);
  }, [CONTROLS_AUTO_HIDE_MS]);

  const cancelHideControls = useCallback(() => {
    if (controlsHideTimerRef.current) {
      clearTimeout(controlsHideTimerRef.current);
      controlsHideTimerRef.current = null;
    }
  }, []);

  const seekToLiveEdge = useCallback(() => {
    const video = videoRef?.current;
    if (!video) return;
    const liveSync = hlsRef.current?.liveSyncPosition;
    const seekableEnd =
      video.seekable.length > 0 ? video.seekable.end(video.seekable.length - 1) : null;
    const target =
      typeof liveSync === 'number' && Number.isFinite(liveSync) ? liveSync : seekableEnd;
    if (target != null && Number.isFinite(target)) {
      try {
        video.currentTime = target;
      } catch {
        // ignore seek errors
      }
    }
  }, [videoRef]);

  const togglePlayPause = useCallback(() => {
    const video = videoRef?.current;
    if (!video) return;
    if (video.paused) {
      if (room?.status === 'live' || room?.status === 'waitingReconnect') {
        seekToLiveEdge();
      }
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [videoRef, room?.status, seekToLiveEdge]);

  /**
   * Return the player to a plain-viewer state. Leaving the co-host stage pauses the video
   * element, and `handlePause` pins the play/pause control open (it cancels the auto-hide),
   * so the control stayed visible after dropping back to the viewer view. Resume playback at
   * the live edge and hide the control again.
   */
  const resumeAsViewer = useCallback(() => {
    const video = videoRef?.current;
    cancelHideControls();
    setShowControls(false);

    if (video?.paused) {
      if (room?.status === 'live' || room?.status === 'waitingReconnect') {
        seekToLiveEdge();
      }
      video.play().catch(() => {});
    }
  }, [videoRef, cancelHideControls, room?.status, seekToLiveEdge]);

  const toggleControls = useCallback(() => {
    setShowControls((prev) => {
      const next = !prev;
      if (next && !isPaused) scheduleHideControls();
      else cancelHideControls();
      return next;
    });
  }, [scheduleHideControls, cancelHideControls, isPaused]);

  const setUpHLS = (
    player: HTMLVideoElement,
    livePlaybackUrl: string,
    isRecorded: boolean = false,
  ) => {
    // Clean up existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const hls = new Hls({
      debug: false,
      xhrSetup: (xhr) => {
        xhr.setRequestHeader('Authorization', `Bearer ${client?.token?.accessToken}`);
      },
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
      // Initialize Plyr for live videos only, not for recorded
      if (!isRecorded) {
        plyrRef.current = new Plyr(player, {
          controls: [],
          fullscreen: { enabled: false },
          clickToPlay: false,
        });
      }
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
    player.addEventListener('play', handlePlay);
    player.addEventListener('pause', handlePause);

    // Handle video source based on room status
    if ((room?.status === 'live' || room?.status === 'waitingReconnect') && room?.livePlaybackUrl) {
      // Setup for live video - with Plyr controls and HLS

      player.controls = false;
      setUpHLS(player, room.livePlaybackUrl);
    } else if (room?.status === 'recorded') {
      // Setup for recorded video - with HLS but no Plyr
      player.controls = true;
      const recordedUrl = room?.recordedPlaybackInfos?.[0]?.url;
      if (recordedUrl) {
        setUpHLS(player, recordedUrl, true);
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

  const handlePlay = () => {
    setIsPaused(false);
    scheduleHideControls();
  };

  const handlePause = () => {
    setIsPaused(true);
    setShowControls(true);
    cancelHideControls();
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
    video.removeEventListener('play', handlePlay);
    video.removeEventListener('pause', handlePause);

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
        currentVideo.removeEventListener('play', handlePlay);
        currentVideo.removeEventListener('pause', handlePause);
      }
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      if (controlsHideTimerRef.current) {
        clearTimeout(controlsHideTimerRef.current);
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
    isPaused,
    showControls,
    togglePlayPause,
    toggleControls,
    resumeAsViewer,
  };
};
