import React, { useCallback, useEffect, useState } from 'react';
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
};

export const REGION_CONFIG: Record<string, RegionConfig> = {
  Staging: {
    sdkRegion: import.meta.env.STORYBOOK_SDK_REGION_STAGING || '',
    defaultApiKey: import.meta.env.STORYBOOK_API_KEY_STAGING || '',
    uploadUrl: import.meta.env.STORYBOOK_UPLOAD_URL_STAGING || '',
  },
  SG: {
    sdkRegion: import.meta.env.STORYBOOK_SDK_REGION_SG || '',
    defaultApiKey: import.meta.env.STORYBOOK_API_KEY_SG || '',
    uploadUrl: import.meta.env.STORYBOOK_UPLOAD_URL_SG || '',
  },
  EU: {
    sdkRegion: import.meta.env.STORYBOOK_SDK_REGION_EU || '',
    defaultApiKey: import.meta.env.STORYBOOK_API_KEY_EU || '',
    uploadUrl: import.meta.env.STORYBOOK_UPLOAD_URL_EU || '',
  },
  US: {
    sdkRegion: import.meta.env.STORYBOOK_SDK_REGION_US || '',
    defaultApiKey: import.meta.env.STORYBOOK_API_KEY_US || '',
    uploadUrl: import.meta.env.STORYBOOK_UPLOAD_URL_US || '',
  },
};

const DEFAULT_REGION = import.meta.env.STORYBOOK_DEFAULT_REGION || 'Staging';

const decorator: NonNullable<Preview['decorators']>[number] = (Story, context) => {
  const [args, updateArgs] = useArgs();

  // ── Sync apiKey + uploadUrl into the Controls panel when region changes ──────
  useEffect(() => {
    const regionLabel: string = args.apiRegion || DEFAULT_REGION;
    const preset = REGION_CONFIG[regionLabel];
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
  const preset = REGION_CONFIG[regionLabel];
  const sdkRegion = preset?.sdkRegion ?? import.meta.env.STORYBOOK_API_REGION;
  const resolvedApiKey = args.apiKey || import.meta.env.STORYBOOK_API_KEY;
  const resolvedUploadUrl = args.uploadUrl || undefined;

  // ── Identity ───────────────────────────────────────────────────────────────
  const currentUserId =
    !args.userType || args.userType === 'signed-in' ? args.userId || FALLBACK_USER : undefined;

  const [userId, setUserId] = useState<string | undefined>(currentUserId);
  const [displayNameState, setDisplayNameState] = useState<string | undefined>(
    args.displayName || args.userId || userId,
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
    if (args.displayName) setDisplayNameState(args.displayName);
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
      apiEndpoint={resolvedUploadUrl ? { upload: resolvedUploadUrl } : undefined}
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
