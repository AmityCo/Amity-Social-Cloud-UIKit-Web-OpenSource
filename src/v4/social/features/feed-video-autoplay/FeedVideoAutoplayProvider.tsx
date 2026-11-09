import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useSDK from '~/v4/core/hooks/useSDK';
import { useFeedSettingsQuery } from '~/v4/social/hooks/queries';
import { MEMBER_AUTOPLAY_STORAGE_KEY } from './constants';

export type FeedVideoPlayback = {
  position: number;
  isEnded: boolean;
  segment?: number;
};

type FeedVideoAutoplayContextValue = {
  isAutoplayEnabled: boolean;
  isMemberAutoplayOn: boolean;
  setMemberAutoplayOn: (isOn: boolean) => void;
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
  setBrowserBlocked: () => void;
  getPlayback: (key: string) => FeedVideoPlayback | undefined;
  savePlayback: (key: string, playback: FeedVideoPlayback) => void;
  dropPlayback: (key: string) => void;
  getLastFrame: (key: string) => string | undefined;
  saveLastFrame: (key: string, frame: Blob) => string | undefined;
  getCarouselIndex: (postId: string) => number | undefined;
  saveCarouselIndex: (postId: string, index: number) => void;
  isOverlayOpen: boolean;
  openOverlay: () => () => void;
};

const noop = () => {};

const FeedVideoAutoplayContext = createContext<FeedVideoAutoplayContextValue>({
  isAutoplayEnabled: false,
  isMemberAutoplayOn: true,
  setMemberAutoplayOn: noop,
  isMuted: true,
  setIsMuted: noop,
  setBrowserBlocked: noop,
  getPlayback: () => undefined,
  savePlayback: noop,
  dropPlayback: noop,
  getLastFrame: () => undefined,
  saveLastFrame: () => undefined,
  getCarouselIndex: () => undefined,
  saveCarouselIndex: noop,
  isOverlayOpen: false,
  openOverlay: () => noop,
});

function readMemberAutoplay(): boolean {
  try {
    return window.localStorage.getItem(MEMBER_AUTOPLAY_STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

function writeMemberAutoplay(isOn: boolean) {
  try {
    window.localStorage.setItem(MEMBER_AUTOPLAY_STORAGE_KEY, isOn ? 'on' : 'off');
  } catch {
    return;
  }
}

function isVideoContentSetting(
  setting: Amity.ContentSetting,
): setting is Amity.ContentSettingVideo & { autoPlay?: boolean } {
  return setting.contentType === 'video';
}

export function FeedVideoAutoplayProvider({ children }: { children: React.ReactNode }) {
  const { currentUserId, isVisitorOrBot } = useSDK();
  const { feedSettings } = useFeedSettingsQuery();
  const [isMemberAutoplayOn, setIsMemberAutoplayOnState] = useState(readMemberAutoplay);
  const [isMuted, setIsMuted] = useState(true);
  const [isBrowserBlocked, setIsBrowserBlocked] = useState(false);
  const [overlayCount, setOverlayCount] = useState(0);
  const playbackRef = useRef(new Map<string, FeedVideoPlayback>());
  const droppedRef = useRef(new Set<string>());
  const lastFrameRef = useRef(new Map<string, string>());
  const carouselIndexRef = useRef(new Map<string, number>());

  const isNetworkAutoplayOn = feedSettings?.post?.find(isVideoContentSetting)?.autoPlay ?? false;

  useEffect(() => {
    setIsMuted(true);
    setIsBrowserBlocked(false);
    playbackRef.current.clear();
    droppedRef.current.clear();
    lastFrameRef.current.forEach((url) => URL.revokeObjectURL(url));
    lastFrameRef.current.clear();
    carouselIndexRef.current.clear();
  }, [currentUserId]);

  useEffect(() => {
    const lastFrames = lastFrameRef.current;
    return () => lastFrames.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === MEMBER_AUTOPLAY_STORAGE_KEY) {
        setIsMemberAutoplayOnState(readMemberAutoplay());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setMemberAutoplayOn = useCallback((isOn: boolean) => {
    writeMemberAutoplay(isOn);
    setIsMemberAutoplayOnState(isOn);
  }, []);

  const setBrowserBlocked = useCallback(() => setIsBrowserBlocked(true), []);

  const getPlayback = useCallback((key: string) => playbackRef.current.get(key), []);

  const savePlayback = useCallback((key: string, playback: FeedVideoPlayback) => {
    if (droppedRef.current.has(key)) return;
    playbackRef.current.set(key, playback);
  }, []);

  const getLastFrame = useCallback((key: string) => lastFrameRef.current.get(key), []);

  const saveLastFrame = useCallback((key: string, frame: Blob) => {
    if (droppedRef.current.has(key)) return undefined;
    const previousUrl = lastFrameRef.current.get(key);
    if (previousUrl) URL.revokeObjectURL(previousUrl);
    const url = URL.createObjectURL(frame);
    lastFrameRef.current.set(key, url);
    return url;
  }, []);

  const dropPlayback = useCallback((key: string) => {
    droppedRef.current.add(key);
    playbackRef.current.delete(key);
    const lastFrameUrl = lastFrameRef.current.get(key);
    if (lastFrameUrl) URL.revokeObjectURL(lastFrameUrl);
    lastFrameRef.current.delete(key);
  }, []);

  const getCarouselIndex = useCallback(
    (postId: string) => carouselIndexRef.current.get(postId),
    [],
  );

  const saveCarouselIndex = useCallback((postId: string, index: number) => {
    carouselIndexRef.current.set(postId, index);
  }, []);

  const openOverlay = useCallback(() => {
    setOverlayCount((count) => count + 1);
    return () => setOverlayCount((count) => Math.max(0, count - 1));
  }, []);

  const value = useMemo<FeedVideoAutoplayContextValue>(
    () => ({
      isAutoplayEnabled:
        !!currentUserId &&
        isNetworkAutoplayOn &&
        !isBrowserBlocked &&
        (isVisitorOrBot || isMemberAutoplayOn),
      isMemberAutoplayOn: isVisitorOrBot || isMemberAutoplayOn,
      setMemberAutoplayOn,
      isMuted,
      setIsMuted,
      setBrowserBlocked,
      getPlayback,
      savePlayback,
      dropPlayback,
      getLastFrame,
      saveLastFrame,
      getCarouselIndex,
      saveCarouselIndex,
      isOverlayOpen: overlayCount > 0,
      openOverlay,
    }),
    [
      currentUserId,
      isVisitorOrBot,
      isNetworkAutoplayOn,
      isMemberAutoplayOn,
      setMemberAutoplayOn,
      isBrowserBlocked,
      isMuted,
      setBrowserBlocked,
      getPlayback,
      savePlayback,
      dropPlayback,
      getLastFrame,
      saveLastFrame,
      getCarouselIndex,
      saveCarouselIndex,
      overlayCount,
      openOverlay,
    ],
  );

  return (
    <FeedVideoAutoplayContext.Provider value={value}>{children}</FeedVideoAutoplayContext.Provider>
  );
}

export function useFeedVideoAutoplay() {
  return useContext(FeedVideoAutoplayContext);
}

export function useFeedVideoSoundState(defaultMuted: boolean) {
  const { isAutoplayEnabled, isMuted, setIsMuted } = useFeedVideoAutoplay();
  const [isSessionShared] = useState(isAutoplayEnabled);
  const [isLocalMuted, setIsLocalMuted] = useState(defaultMuted);

  if (isSessionShared) return [isMuted, setIsMuted] as const;
  return [isLocalMuted, setIsLocalMuted] as const;
}

export function useFeedVideoAutoplayOverlay(isOpen = true) {
  const { openOverlay } = useFeedVideoAutoplay();

  useEffect(() => {
    if (!isOpen) return;
    return openOverlay();
  }, [isOpen, openOverlay]);
}
