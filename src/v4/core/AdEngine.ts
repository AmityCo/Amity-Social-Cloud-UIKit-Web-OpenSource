import { Client as ASCClient, AdRepository } from '@amityco/ts-sdk';
import { TimeWindowTracker } from './TimeWindowTracker';

class SeenRecencyCache {
  static #instance: SeenRecencyCache;
  #persistentCacheKey = 'amity.seenRecencyCache';

  constructor() {}

  public static get instance(): SeenRecencyCache {
    if (!SeenRecencyCache.#instance) {
      SeenRecencyCache.#instance = new SeenRecencyCache();
    }
    return SeenRecencyCache.#instance;
  }

  #getSeenRecencyCache() {
    return JSON.parse(window.localStorage.getItem(this.#persistentCacheKey) || '{}');
  }

  getSeenRecencyByAdId(adId: string): number {
    return this.#getSeenRecencyCache()[adId];
  }

  setSeenRecencyCache(adId: string, value: number) {
    const seenRecencyCache = this.#getSeenRecencyCache();
    seenRecencyCache[adId] = value;
    window.localStorage.setItem(this.#persistentCacheKey, JSON.stringify(seenRecencyCache));
  }
}

export class AdEngine {
  static #instance: AdEngine;

  private isLoading = true;
  private ads: Amity.Ad[] = [];
  private settings: Amity.AdsSettings | null = null;

  private subscribers: Array<(networkAds: Amity.NetworkAds | null) => void> = [];

  private constructor() {
    ASCClient.onSessionStateChange(async (state: Amity.SessionStates) => {
      if (state === 'established') {
        const networkAds = await AdRepository.getNetworkAds();
        this.ads = networkAds.ads;
        this.settings = networkAds.settings;
        this.subscribers.forEach((subscriber) => subscriber(networkAds));
        this.isLoading = false;
      } else if (state === 'terminated') {
        this.ads = [];
        this.settings = null;
        this.subscribers.forEach((subscriber) => subscriber(null));
      }
    });
  }

  public static get instance(): AdEngine {
    if (!AdEngine.#instance) {
      AdEngine.#instance = new AdEngine();
    }
    return AdEngine.#instance;
  }

  onNetworkAdsData(callback: (networkAds: Amity.NetworkAds | null) => void) {
    if (!this.isLoading && this.ads.length > 0 && this.settings) {
      callback({ ads: this.ads, settings: this.settings });
    }
    this.subscribers.push(callback);
  }

  #getAdFrequency(placement: Amity.AdPlacement) {
    if (!this.settings) return null;
    switch (placement) {
      case 'feed':
        return this.settings.frequency.feed;
      case 'comment':
        return this.settings.frequency.comment;
      case 'story':
        return this.settings.frequency.story;
      default:
        return null;
    }
  }

  getLastSeen(adId: string) {
    return SeenRecencyCache.instance.getSeenRecencyByAdId(adId);
  }

  markSeen(ad: Amity.Ad, placement: Amity.AdPlacement) {
    SeenRecencyCache.instance.setSeenRecencyCache(ad.adId, Date.now());
    if (this.#getAdFrequency(placement)?.type === 'time-window') {
      TimeWindowTracker.instance.markSeen(placement);
    }
    ad.analytics.markAsSeen(placement);
  }

  markClicked(ad: Amity.Ad, placement: Amity.AdPlacement) {
    ad.analytics.markLinkAsClicked(placement);
  }

  getAdFrequencyByPlacement(placement: Amity.AdPlacement) {
    return this.#getAdFrequency(placement);
  }
}
