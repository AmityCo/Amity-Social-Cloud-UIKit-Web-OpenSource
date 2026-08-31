import { AmityLiveViewerCountMode } from '@amityco/ts-sdk';
import { useQuery } from '@tanstack/react-query';
import useSDK from '~/v4/core/hooks/useSDK';

const FAILOPEN_CONFIG: Amity.LiveViewerCountConfig = {
  mode: AmityLiveViewerCountMode.ALWAYS_SHOW,
  threshold: 50,
};

/**
 * Cold-reads the network-level viewer-count config **once per mount**.
 *
 * Every time this hook mounts — i.e., every time the viewer enters the
 * livestream player page — it fires `client.getLiveViewerCountConfig()`
 * fresh, so the visibility rule always evaluates against the *latest*
 * admin-saved config for that entry.
 *
 * Per spec REQ-009, the hook does NOT observe the config after mount:
 * admin-driven changes only apply on the *next* entry (leave-and-rejoin).
 *
 * REQ-011: fail-open to `{ alwaysShow, 50 }` on SDK / network error.
 * REQ-012: malformed payload is handled by the SDK itself (falls open to the
 * same default and logs a warning), so no local sanitisation is needed.
 * REQ-013: `isLoading` stays true until the cold-read resolves so the caller
 * can suppress render (no flicker).
 */
export function useLiveViewerCountConfig(): {
  config: Amity.LiveViewerCountConfig | null;
  isLoading: boolean;
} {
  const { client } = useSDK();

  const { data: config, isLoading } = useQuery({
    queryKey: ['asc-uikit', 'LiveViewerCountConfig'],
    queryFn: async (): Promise<Amity.LiveViewerCountConfig> => {
      try {
        const raw = await client?.getLiveViewerCountConfig();
        return raw ?? FAILOPEN_CONFIG;
      } catch {
        return FAILOPEN_CONFIG;
      }
    },
    enabled: !!client,
  });

  return { config: config ?? null, isLoading };
}
