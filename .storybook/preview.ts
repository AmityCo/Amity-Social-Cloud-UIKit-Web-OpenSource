import { Preview } from '@storybook/react';
import { FluidControl, UiKitV4Decorator } from './decorators';

const preview: Preview = {
  // Args order matches the spec field order (Screen 1 → Screen 2):
  //   User: userId, displayName, userType
  //   Network: apiRegion, apiKey, uploadUrl
  //   Security: authSignatureExpiresAt, secureMode
  //   Behaviour: syncNetworkConfig, visitorCanViewClip, hideExplore, socialCommunityCreationButtonVisible
  //   Appearance: theme
  args: {
    // ── User ──────────────────────────────────────────────────────────────
    userId: undefined,
    displayName: undefined,
    userType: 'signed-in',
    // ── Network ───────────────────────────────────────────────────────────
    // Default region and initial API key come from .env — set
    // STORYBOOK_DEFAULT_REGION and STORYBOOK_API_KEY_<REGION> there.
    // The decorator re-fills apiKey/uploadUrl whenever apiRegion changes.
    apiRegion: import.meta.env.STORYBOOK_DEFAULT_REGION,
    apiKey: import.meta.env.STORYBOOK_API_KEY_STAGING || import.meta.env.STORYBOOK_API_KEY || '',
    uploadUrl: import.meta.env.STORYBOOK_UPLOAD_URL_STAGING,
    // ── Security ──────────────────────────────────────────────────────────
    secureMode: false,
    authSignatureExpiresAt: new Date(),
    // Internal gate — kept in sync by the decorator; not shown in Controls.
    // authSignatureExpiresAt is visible only when this is true (userType=visitor AND secureMode=true).
    _showAuthExpiry: false,
    // ── Behaviour ─────────────────────────────────────────────────────────
    syncNetworkConfig: false,
    seoOptimizationEnabled: false,
    visitorCanViewClip: false,
    hideExplore: false,
    socialCommunityCreationButtonVisible: true,
    // ── Appearance ────────────────────────────────────────────────────────
    // theme: default (no default set — provider uses its own default)
    // ── Submit trigger ────────────────────────────────────────────────────
    submit: false,
  },
  argTypes: {
    // The module switches lived here. They wrote `config.features`, which no
    // longer exists — whether a module exists is the network's plan to answer
    // and nobody else's. The other route, standing in for the plan itself,
    // needed an override prop on the provider that was public API and was
    // removed. Controls that cannot move anything read as a working gate from
    // outside, so they are gone until one of those routes is back; the panel
    // in the corner still reports what this network's plan withheld.
    // ── User ──────────────────────────────────────────────────────────────
    userId: {
      name: 'User ID',
      control: { type: 'text' },
      description: 'User ID. Defaults to "Web-Test" when blank.',
      table: { category: 'User' },
    },
    displayName: {
      name: 'Display Name',
      control: { type: 'text' },
      description: 'Display name (optional). Uses User ID when blank.',
      table: { category: 'User' },
    },
    userType: {
      name: 'User Type',
      control: { type: 'select' },
      options: ['signed-in', 'visitor', 'bot'],
      description: 'Login method. "bot" is Web/Storybook only.',
      table: { category: 'User' },
    },
    // ── Network ───────────────────────────────────────────────────────────
    apiRegion: {
      name: 'API Region',
      control: { type: 'select' },
      options: ['staging', 'sg', 'eu', 'us'],
      description: 'API region. Selecting a region auto-fills API Key and Upload URL.',
      table: { category: 'Network' },
    },
    apiKey: {
      name: 'API Key (linked to region)',
      control: { type: 'text' },
      description:
        'Auto-filled per region; always editable. Use "↺ Reset API Key" below to restore region default.',
      table: { category: 'Network' },
    },
    uploadUrl: {
      name: 'Upload URL (linked to region)',
      control: { type: 'text' },
      description: 'Auto-derived from region (e.g. https://upload.sg.amity.co). Always editable.',
      table: { category: 'Network' },
    },
    // ── Security ──────────────────────────────────────────────────────────
    secureMode: {
      name: 'Secure Mode',
      control: { type: 'boolean' },
      description: 'Enable secure mode — requires getAuthSignature to be configured.',
      table: { category: 'Security' },
    },
    authSignatureExpiresAt: {
      name: 'Auth Signature Expires At',
      control: { type: 'date' },
      description:
        'Auth signature expiration date and time. Visible only when User Type = visitor and Secure Mode = on.',
      // Shown only when userType=visitor AND secureMode=true (gate via hidden _showAuthExpiry arg)
      if: { arg: '_showAuthExpiry', truthy: true },
      table: { category: 'Security' },
    },
    _showAuthExpiry: {
      // Internal computed arg — hidden from the Controls panel
      table: { disable: true },
    },
    // ── Behaviour ─────────────────────────────────────────────────────────
    syncNetworkConfig: {
      name: 'Sync Network Config',
      control: { type: 'boolean' },
      table: { category: 'Behaviour' },
    },
    seoOptimizationEnabled: {
      name: 'SEO Optimization (no realtime)',
      control: { type: 'boolean' },
      description:
        'Turns off the realtime engine, which is also what lets a capture run reach the app ' +
        'without a reachable MQTT broker — the login awaits its topic subscriptions otherwise.',
      table: { category: 'Behaviour' },
    },
    visitorCanViewClip: {
      name: 'Visitor Can View Clip',
      control: { type: 'boolean' },
      table: { category: 'Behaviour' },
    },
    hideExplore: {
      name: 'Hide Explore',
      control: { type: 'boolean' },
      description: 'Hide the Explore tab in Social.',
      table: { category: 'Behaviour' },
    },
    socialCommunityCreationButtonVisible: {
      name: 'Social Community Creation Button',
      control: { type: 'boolean' },
      description: 'Show/hide the community creation button.',
      table: { category: 'Behaviour' },
    },
    // ── Appearance ────────────────────────────────────────────────────────
    theme: {
      name: 'Theme',
      options: ['default', 'light', 'dark'],
      control: { type: 'radio' },
      description: 'UI theme.',
      table: { category: 'Appearance' },
    },
    // ── Submit trigger ────────────────────────────────────────────────────
    submit: {
      name: 'Submit',
      control: { type: 'boolean' },
      description: 'Toggle to apply User ID / Display Name changes without reloading.',
      table: { category: 'Submit' },
    },
  },
  decorators: [FluidControl.decorator, (Story, ctx) => UiKitV4Decorator.decorator(Story, ctx)],
  parameters: {
    options: {
      storySort: {
        order: ['Social', 'Chat'],
      },
    },
  },
  globalTypes: {
    ...FluidControl.global,
  },
};

export default preview;
