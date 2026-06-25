import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useArgs } from '@storybook/preview-api';
import { AmityUIKitProvider } from '../../src/v4/core/providers';
import { Preview } from '@storybook/react';
import amityConfig from '../../amity-uikit.config.json';
import { Config } from '../../src/v4/core/providers/CustomizationProvider';

type AuthSignatureResponse = {
  signature: string;
  input?: {
    deviceId: string;
    authSignatureExpiresAt: string;
    dataToSign: string;
  };
};

const FALLBACK_USER = 'Web-Test';

// ── Region configuration ─────────────────────────────────────────────────────
// Maps the Storybook region label → SDK region string + defaults.
// Set STORYBOOK_API_KEY_<REGION> in .env to populate keys for each region.
// In open-source builds the keys default to '' — contributors set their own.
type RegionConfig = {
  sdkRegion: string;
  defaultApiKey: string;
  uploadUrl: string;
  /** Custom cluster (not a standard SDK region) — must pass a full apiEndpoint. */
  custom?: boolean;
};

// OSS-safe: public regions (SG/EU/US) fall back to their public region string;
// Staging is ENV-ONLY (no internal endpoints hardcoded) so this exact file can
// ship to the open-source repo. The empty-region guard below (sdkRegion || 'sg')
// prevents a malformed "apix..amity.co" when an env value is missing.
export const REGION_CONFIG: Record<string, RegionConfig> = {
  Staging: {
    // Internal cluster — supplied only via the gitignored .env, never in code.
    sdkRegion: import.meta.env.STORYBOOK_SDK_REGION_STAGING || '',
    defaultApiKey: import.meta.env.STORYBOOK_API_KEY_STAGING || '',
    uploadUrl: import.meta.env.STORYBOOK_UPLOAD_URL_STAGING || '',
    custom: true,
  },
  SG: {
    sdkRegion: import.meta.env.STORYBOOK_SDK_REGION_SG || 'sg',
    defaultApiKey: import.meta.env.STORYBOOK_API_KEY_SG || '',
    uploadUrl: import.meta.env.STORYBOOK_UPLOAD_URL_SG || '',
  },
  EU: {
    sdkRegion: import.meta.env.STORYBOOK_SDK_REGION_EU || 'eu',
    defaultApiKey: import.meta.env.STORYBOOK_API_KEY_EU || '',
    uploadUrl: import.meta.env.STORYBOOK_UPLOAD_URL_EU || '',
  },
  US: {
    sdkRegion: import.meta.env.STORYBOOK_SDK_REGION_US || 'us',
    defaultApiKey: import.meta.env.STORYBOOK_API_KEY_US || '',
    uploadUrl: import.meta.env.STORYBOOK_UPLOAD_URL_US || '',
  },
};

// Public default in code ('SG'). Internal devs set STORYBOOK_DEFAULT_REGION
// (e.g. 'staging') in their gitignored .env to default to a private cluster.
// Looked up case-insensitively by getPreset.
const DEFAULT_REGION = import.meta.env.STORYBOOK_DEFAULT_REGION || 'SG';

const getPreset = (label?: string): RegionConfig | undefined => {
  if (!label) return undefined;
  const key = Object.keys(REGION_CONFIG).find((k) => k.toLowerCase() === label.toLowerCase());
  return key ? REGION_CONFIG[key] : undefined;
};

// Builds the apiEndpoint for the SDK. Custom clusters (staging) get a full
// http/mqtt/upload endpoint so the URL never depends on region templating.
const buildApiEndpoint = (
  preset: RegionConfig | undefined,
  sdkRegion: string,
  uploadUrl?: string,
): { http?: string; mqtt?: string; upload?: string } | undefined => {
  if (preset?.custom) {
    return {
      http: `https://apix.${sdkRegion}.amity.co`,
      mqtt: `wss://sse.${sdkRegion}.amity.co:443/mqtt`,
      upload: uploadUrl || preset.uploadUrl || `https://upload.${sdkRegion}.amity.co`,
    };
  }
  return uploadUrl ? { upload: uploadUrl } : undefined;
};

const decorator: NonNullable<Preview['decorators']>[number] = (Story, context) => {
  const [args, updateArgs] = useArgs();

  // ── Auto-fill apiKey + uploadUrl ONLY on a genuine region switch ─────────────
  // Skipping the first run (mount/reload) preserves a user-edited apiKey that
  // Storybook restores from the URL args — otherwise it gets clobbered back to
  // the region default on every reload.
  const prevRegionRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    const regionLabel: string = args.apiRegion || DEFAULT_REGION;
    if (prevRegionRef.current === undefined) {
      // First run after mount/reload — remember region, don't overwrite args.
      prevRegionRef.current = regionLabel;
      return;
    }
    if (prevRegionRef.current === regionLabel) return;
    prevRegionRef.current = regionLabel;
    const preset = getPreset(regionLabel);
    if (preset) {
      updateArgs({ apiKey: preset.defaultApiKey, uploadUrl: preset.uploadUrl });
    }
  }, [args.apiRegion]);

  // ── Show Auth Signature Expires At only when visitor + secureMode ────────────
  useEffect(() => {
    updateArgs({ _showAuthExpiry: args.userType === 'visitor' && !!args.secureMode });
  }, [args.userType, args.secureMode]);

  // ── Resolve SDK values from current (possibly user-edited) args ─────────────
  const regionLabel: string = args.apiRegion || DEFAULT_REGION;
  const preset = getPreset(regionLabel);

  const sdkRegion = preset?.sdkRegion || import.meta.env.STORYBOOK_API_REGION || 'sg';
  // User-entered key wins; fall back to the region preset, then the env default.
  const resolvedApiKey = args.apiKey || preset?.defaultApiKey || import.meta.env.STORYBOOK_API_KEY;
  const resolvedUploadUrl = args.uploadUrl || preset?.uploadUrl || undefined;
  const resolvedApiEndpoint = buildApiEndpoint(preset, sdkRegion, resolvedUploadUrl);

  // ── Identity ───────────────────────────────────────────────────────────────
  const currentUserId =
    !args.userType || args.userType === 'signed-in' ? args.userId || FALLBACK_USER : undefined;

  const [userId, setUserId] = useState<string | undefined>(currentUserId);
  // Empty → undefined so it falls back to the userId (see `displayName` below).
  const [displayNameState, setDisplayNameState] = useState<string | undefined>(
    args.displayName || undefined,
  );

  if (args.visitorCanViewClip) {
    amityConfig.feature_flags.post.clip.can_view_tab = 'all';
  }

  const authSignatureExpiresAt =
    args.authSignatureExpiresAt && args.userType === 'visitor'
      ? new Date(args.authSignatureExpiresAt)?.toISOString()
      : undefined;

  const [config, setConfig] = useState<Config>(amityConfig as any);

  useEffect(() => {
    if (!args.submit) return;
    if (args.userId) setUserId(args.userId);
    // Always sync displayName; empty clears it so it falls back to the userId
    // (prevents a stale displayName when the userId changes).
    setDisplayNameState(args.displayName || undefined);
  }, [args.submit]);

  const displayName = displayNameState || userId;

  const handleConnectionStatusChange = useCallback((...a) => {
    console.log(`[UiKitProvider.handleConnectionStatusChange]`, ...a);
  }, []);

  const handleConnected = useCallback((...a) => {
    console.log(`[UiKitProvider.handleConnected]`, ...a);
  }, []);

  const handleDisconnected = useCallback((...a) => {
    console.log(`[UiKitProvider.handleDisconnected]`, ...a);
  }, []);

  useEffect(() => {
    if (args.theme) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        preferred_theme: args.theme,
      }));
    }
  }, [args.theme]);

  const getAuthSignature = async ({
    deviceId,
    authSignatureExpiresAt,
  }: {
    deviceId: string;
    authSignatureExpiresAt: string;
  }) => {
    const url =
      import.meta.env.STORYBOOK_VISITOR_AUTH_SIGNATURE_URL! +
      `/?deviceId=${encodeURIComponent(deviceId)}&authSignatureExpiresAt=${encodeURIComponent(authSignatureExpiresAt)}`;

    const response = await fetch(url);
    const responseJson = (await response.json()) as AuthSignatureResponse;

    return responseJson.signature;
  };

  return (
    <AmityUIKitProvider
      apiKey={resolvedApiKey}
      apiRegion={sdkRegion}
      apiEndpoint={resolvedApiEndpoint}
      key={`${sdkRegion}-${userId}`}
      userId={userId}
      displayName={displayName || userId}
      onConnectionStatusChange={handleConnectionStatusChange}
      onConnected={handleConnected}
      onDisconnected={handleDisconnected}
      configs={config as Config}
      syncNetworkConfig={args.syncNetworkConfig}
      isBotUser={args.userType === 'bot'}
      authSignatureExpiresAt={authSignatureExpiresAt}
      getAuthSignature={args.secureMode ? getAuthSignature : undefined}
      socialCommunityCreationButtonVisible={args.socialCommunityCreationButtonVisible ?? true}
      hideExplore={args.hideExplore ?? false}
    >
      <Story />
    </AmityUIKitProvider>
  );
};

export default { global, decorator };
