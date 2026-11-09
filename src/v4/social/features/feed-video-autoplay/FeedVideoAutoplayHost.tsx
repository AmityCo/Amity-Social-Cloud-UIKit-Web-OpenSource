import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useDrawerData } from '~/v4/core/providers/DrawerProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useFeedVideoAutoplay } from './FeedVideoAutoplayProvider';
import {
  AUTOPLAY_OBSERVER_THRESHOLDS,
  AUTOPLAY_SHARE_EPSILON,
  AUTOPLAY_VISIBLE_SHARE,
  SWIPE_HANDOVER_MS,
  WARM_AHEAD_COUNT,
} from './constants';
import { preconnectVideoStream } from './playlistWarmup';

type Candidate = {
  element: HTMLElement;
  isEligible: boolean;
  onActiveChange: (isActive: boolean) => void;
  warm: () => void;
};

type Visibility = {
  share: number;
  top: number;
};

type FeedVideoAutoplayHostValue = {
  register: (key: string, candidate: Candidate) => () => void;
  setEligible: (key: string, isEligible: boolean) => void;
  release: (key: string) => void;
  claim: (key: string) => boolean;
};

const FeedVideoAutoplayHostContext = createContext<FeedVideoAutoplayHostValue | null>(null);

let candidateCount = 0;

function getVisibleShare(entry: IntersectionObserverEntry): number {
  if (!entry.isIntersecting) return 0;
  const visibleHeight = entry.intersectionRect.height;
  const ownHeight = entry.boundingClientRect.height;
  const screenHeight = entry.rootBounds?.height || window.innerHeight;
  if (ownHeight <= 0 || screenHeight <= 0) return 0;
  return Math.max(visibleHeight / ownHeight, visibleHeight / screenHeight);
}

function usePageVisible() {
  const [isPageVisible, setIsPageVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden,
  );

  useEffect(() => {
    const handleChange = () => setIsPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleChange);
    return () => document.removeEventListener('visibilitychange', handleChange);
  }, []);

  return isPageVisible;
}

function useOnline() {
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator === 'undefined' || navigator.onLine !== false,
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export function FeedVideoAutoplayHost({ children }: { children: React.ReactNode }) {
  const { isAutoplayEnabled, isOverlayOpen } = useFeedVideoAutoplay();
  const isPageVisible = usePageVisible();
  const { popups } = usePopupContext();
  const drawerData = useDrawerData();
  const { confirmData } = useConfirmContext();
  const isCovered = isOverlayOpen || popups.length > 0 || !!drawerData || !!confirmData;
  const isOnline = useOnline();
  const isRunning = isAutoplayEnabled && !isCovered && isPageVisible && isOnline;
  const isPaused = isAutoplayEnabled && isOnline && (isCovered || !isPageVisible);

  const isRunningRef = useRef(isRunning);
  const isPausedRef = useRef(isPaused);
  const candidatesRef = useRef(new Map<string, Candidate>());
  const visibilityRef = useRef(new Map<string, Visibility>());
  const keyByElementRef = useRef(new WeakMap<Element, string>());
  const releasedRef = useRef(new Set<string>());
  const activeKeyRef = useRef<string | null>(null);
  const pausedKeyRef = useRef<string | null>(null);
  const handoverTimerRef = useRef<number | null>(null);
  const claimedKeyRef = useRef<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  isRunningRef.current = isRunning;
  isPausedRef.current = isPaused;

  const setActiveKey = useCallback((key: string | null) => {
    const previousKey = activeKeyRef.current;
    if (claimedKeyRef.current !== key) claimedKeyRef.current = null;
    if (previousKey === key) return;
    activeKeyRef.current = key;
    if (previousKey) candidatesRef.current.get(previousKey)?.onActiveChange(false);
    if (key) candidatesRef.current.get(key)?.onActiveChange(true);
  }, []);

  const getShare = useCallback((key: string) => visibilityRef.current.get(key)?.share ?? 0, []);

  const isStillVisible = useCallback(
    (key: string) =>
      key === claimedKeyRef.current ? getShare(key) > 0 : getShare(key) >= AUTOPLAY_VISIBLE_SHARE,
    [getShare],
  );

  const warmAhead = useCallback(() => {
    if (!isRunningRef.current) return;
    const ordered = [...candidatesRef.current.entries()].sort(([, a], [, b]) =>
      a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    );
    const isVisible = ordered.map(([key]) => getShare(key) > 0);
    const lastVisible = isVisible.lastIndexOf(true);
    if (lastVisible < 0) return;
    ordered.forEach(([, candidate], index) => {
      const isAhead = index > lastVisible && index <= lastVisible + WARM_AHEAD_COUNT;
      if (candidate.isEligible && (isVisible[index] || isAhead)) candidate.warm();
    });
  }, [getShare]);

  const isPlayable = useCallback((key: string) => {
    const candidate = candidatesRef.current.get(key);
    return !!candidate && candidate.isEligible && !releasedRef.current.has(key);
  }, []);

  const findPick = useCallback(() => {
    let pick: string | null = null;
    let pickVisibility: Visibility | null = null;

    candidatesRef.current.forEach((_, key) => {
      const visibility = visibilityRef.current.get(key);
      if (!visibility || !isPlayable(key) || visibility.share < AUTOPLAY_VISIBLE_SHARE) return;
      if (
        !pickVisibility ||
        visibility.share > pickVisibility.share + AUTOPLAY_SHARE_EPSILON ||
        (Math.abs(visibility.share - pickVisibility.share) <= AUTOPLAY_SHARE_EPSILON &&
          visibility.top < pickVisibility.top)
      ) {
        pick = key;
        pickVisibility = visibility;
      }
    });

    return pick as string | null;
  }, [isPlayable]);

  const evaluate = useCallback(() => {
    if (handoverTimerRef.current !== null && isRunningRef.current) return;
    if (!isRunningRef.current) {
      pausedKeyRef.current = isPausedRef.current
        ? activeKeyRef.current ?? pausedKeyRef.current
        : null;
      setActiveKey(null);
      return;
    }

    const keptKey = activeKeyRef.current ?? pausedKeyRef.current;
    pausedKeyRef.current = null;
    if (keptKey && isPlayable(keptKey) && isStillVisible(keptKey)) {
      setActiveKey(keptKey);
      return;
    }

    setActiveKey(findPick());
  }, [setActiveKey, isPlayable, isStillVisible, findPick]);

  const getObserver = useCallback(() => {
    if (observerRef.current || typeof IntersectionObserver === 'undefined') {
      return observerRef.current;
    }
    observerRef.current = new IntersectionObserver(
      (entries) => {
        let hasPlayableEntry = false;
        entries.forEach((entry) => {
          const key = keyByElementRef.current.get(entry.target);
          if (!key) return;
          const share = getVisibleShare(entry);
          visibilityRef.current.set(key, { share, top: entry.boundingClientRect.top });
          if (share >= AUTOPLAY_VISIBLE_SHARE && isPlayable(key)) hasPlayableEntry = true;
        });
        if (handoverTimerRef.current !== null && hasPlayableEntry) {
          window.clearTimeout(handoverTimerRef.current);
          handoverTimerRef.current = null;
        }
        evaluate();
        warmAhead();
      },
      { threshold: AUTOPLAY_OBSERVER_THRESHOLDS },
    );
    return observerRef.current;
  }, [evaluate, warmAhead, isPlayable]);

  const register = useCallback(
    (key: string, candidate: Candidate) => {
      candidatesRef.current.set(key, candidate);
      keyByElementRef.current.set(candidate.element, key);
      releasedRef.current.delete(key);
      getObserver()?.observe(candidate.element);

      return () => {
        observerRef.current?.unobserve(candidate.element);
        if (candidatesRef.current.get(key) !== candidate) return;
        if (activeKeyRef.current === key) activeKeyRef.current = null;
        if (pausedKeyRef.current === key) pausedKeyRef.current = null;
        candidatesRef.current.delete(key);
        visibilityRef.current.delete(key);
        evaluate();
      };
    },
    [getObserver, evaluate],
  );

  const setEligible = useCallback(
    (key: string, isEligible: boolean) => {
      const candidate = candidatesRef.current.get(key);
      if (!candidate || candidate.isEligible === isEligible) return;
      candidate.isEligible = isEligible;
      if (!isEligible && activeKeyRef.current === key && isRunningRef.current) {
        setActiveKey(null);
        if (handoverTimerRef.current !== null) window.clearTimeout(handoverTimerRef.current);
        handoverTimerRef.current = window.setTimeout(() => {
          handoverTimerRef.current = null;
          evaluate();
        }, SWIPE_HANDOVER_MS);
        return;
      }
      evaluate();
    },
    [evaluate, setActiveKey],
  );

  const release = useCallback(
    (key: string) => {
      releasedRef.current.add(key);
      evaluate();
    },
    [evaluate],
  );

  useEffect(() => {
    evaluate();
    warmAhead();
  }, [isRunning, isPaused, evaluate, warmAhead]);

  useEffect(() => {
    if (isAutoplayEnabled) preconnectVideoStream();
  }, [isAutoplayEnabled]);

  useEffect(
    () => () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (handoverTimerRef.current !== null) window.clearTimeout(handoverTimerRef.current);
    },
    [],
  );

  const claim = useCallback(
    (key: string) => {
      if (!isRunningRef.current || !isPlayable(key) || getShare(key) <= 0) return false;
      claimedKeyRef.current = key;
      setActiveKey(key);
      return true;
    },
    [isPlayable, getShare, setActiveKey],
  );

  const valueRef = useRef<FeedVideoAutoplayHostValue>({ register, setEligible, release, claim });

  return (
    <FeedVideoAutoplayHostContext.Provider value={valueRef.current}>
      {children}
    </FeedVideoAutoplayHostContext.Provider>
  );
}

type UseFeedVideoAutoplayCandidateParams = {
  isEligible?: boolean;
  warm?: () => void;
};

export function useFeedVideoAutoplayCandidate({
  isEligible = true,
  warm,
}: UseFeedVideoAutoplayCandidateParams = {}) {
  const host = useContext(FeedVideoAutoplayHostContext);
  const isOnline = useOnline();
  const [key] = useState(() => `feed-video-autoplay-${(candidateCount += 1)}`);
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const isEligibleRef = useRef(isEligible);
  const warmRef = useRef(warm);

  isEligibleRef.current = isEligible;
  warmRef.current = warm;

  useEffect(() => {
    if (!host || !element) return;
    const unregister = host.register(key, {
      element,
      isEligible: isEligibleRef.current,
      onActiveChange: setIsActive,
      warm: () => warmRef.current?.(),
    });
    return () => {
      unregister();
      setIsActive(false);
    };
  }, [host, element, key]);

  useEffect(() => {
    host?.setEligible(key, isEligible);
  }, [host, key, isEligible]);

  const release = useCallback(() => host?.release(key), [host, key]);
  const claim = useCallback(() => host?.claim(key) ?? false, [host, key]);

  return { ref: setElement, isActive, isHosted: !!host, isOnline, release, claim };
}
