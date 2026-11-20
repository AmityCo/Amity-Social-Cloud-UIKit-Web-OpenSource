import Hls, { LoadStats } from 'hls.js';
import type {
  HlsConfig,
  Loader,
  LoaderCallbacks,
  LoaderConfiguration,
  PlaylistLoaderContext,
} from 'hls.js';
import { PLAYLIST_WARM_TTL_MS, VIDEO_STREAM_ORIGIN } from './constants';

type WarmPlaylist = {
  text: string;
  responseUrl: string;
  warmedAt: number;
};

const warmPlaylists = new Map<string, WarmPlaylist>();
const pendingPlaylists = new Map<string, Promise<void>>();
const preconnectedOrigins = new Set<string>();

export function isVideoStreamUrl(url: string) {
  try {
    const { hostname } = new URL(url, window.location.href);
    return hostname === 'mux.com' || hostname.endsWith('.mux.com');
  } catch {
    return false;
  }
}

export function preconnect(origin: string) {
  if (typeof document === 'undefined' || preconnectedOrigins.has(origin)) return;
  preconnectedOrigins.add(origin);
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = origin;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

export function preconnectVideoStream() {
  preconnect(VIDEO_STREAM_ORIGIN);
}

function getWarmPlaylist(url: string) {
  const playlist = warmPlaylists.get(url);
  if (!playlist) return undefined;
  if (Date.now() - playlist.warmedAt > PLAYLIST_WARM_TTL_MS) {
    warmPlaylists.delete(url);
    return undefined;
  }
  return playlist;
}

function getPlaylistUris(text: string, baseUrl: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((uri) => new URL(uri, baseUrl).href);
}

/**
 * Fetches the playlists of a video that is about to autoplay (text only, no
 * video data), so hls.js can start on the first segment when it becomes active.
 */
export function warmPlaylist(url: string, accessToken?: string) {
  if (typeof fetch === 'undefined' || pendingPlaylists.has(url) || getWarmPlaylist(url)) return;

  const headers: Record<string, string> =
    accessToken && !isVideoStreamUrl(url) ? { Authorization: `Bearer ${accessToken}` } : {};

  const pending = fetch(url, { credentials: 'omit', headers })
    .then(async (response) => {
      if (!response.ok) return;
      const text = await response.text();
      const responseUrl = response.url || url;
      warmPlaylists.set(url, { text, responseUrl, warmedAt: Date.now() });
      const uris = getPlaylistUris(text, responseUrl);
      if (text.includes('#EXT-X-STREAM-INF')) {
        uris.forEach((uri) => warmPlaylist(uri));
      } else if (uris[0]) {
        preconnect(new URL(uris[0]).origin);
      }
    })
    .catch(() => undefined)
    .finally(() => pendingPlaylists.delete(url));
  pendingPlaylists.set(url, pending);
}

/**
 * Playlist loader that answers from the warmed playlists and falls back to the
 * default loader for anything that was not warmed.
 */
export class WarmPlaylistLoader implements Loader<PlaylistLoaderContext> {
  private loader: Loader<PlaylistLoaderContext>;

  private timer: number | undefined;

  private isAborted = false;

  private warmContext: PlaylistLoaderContext | null = null;

  private warmStats: LoadStats | null = null;

  constructor(config: HlsConfig) {
    this.loader = new Hls.DefaultConfig.loader(config) as Loader<PlaylistLoaderContext>;
  }

  get context() {
    return this.warmContext ?? this.loader.context;
  }

  get stats() {
    return this.warmStats ?? this.loader.stats;
  }

  load(
    context: PlaylistLoaderContext,
    config: LoaderConfiguration,
    callbacks: LoaderCallbacks<PlaylistLoaderContext>,
  ) {
    this.isAborted = false;
    const pending = pendingPlaylists.get(context.url);
    if (pending) {
      pending.then(() => {
        if (!this.isAborted) this.loadWarm(context, config, callbacks);
      });
      return;
    }
    this.loadWarm(context, config, callbacks);
  }

  private loadWarm(
    context: PlaylistLoaderContext,
    config: LoaderConfiguration,
    callbacks: LoaderCallbacks<PlaylistLoaderContext>,
  ) {
    const playlist = getWarmPlaylist(context.url);
    if (!playlist) {
      this.loader.load(context, config, callbacks);
      return;
    }
    const { text, responseUrl } = playlist;

    const stats = new LoadStats();
    const now = performance.now();
    stats.loading.start = now;
    stats.loading.first = now;
    stats.loading.end = now;
    stats.loaded = text.length;
    stats.total = text.length;
    this.warmContext = context;
    this.warmStats = stats;
    this.timer = window.setTimeout(() => {
      callbacks.onSuccess({ url: responseUrl, data: text, code: 200 }, stats, context, null);
    });
  }

  abort() {
    this.isAborted = true;
    window.clearTimeout(this.timer);
    this.loader.abort();
  }

  destroy() {
    this.isAborted = true;
    window.clearTimeout(this.timer);
    this.loader.destroy();
  }
}
