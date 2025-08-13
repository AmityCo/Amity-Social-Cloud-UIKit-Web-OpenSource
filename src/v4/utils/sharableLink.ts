import { Client as ASCClient } from '@amityco/ts-sdk';

export const getShareableLinkConfiguration =
  async (): Promise<Amity.ShareableLinkConfiguration> => {
    try {
      const config = localStorage.getItem('sharableLinkConfig');
      if (!config) {
        const sharableLinkConfig = await ASCClient.getShareableLinkConfiguration();
        localStorage.setItem('sharableLinkConfig', JSON.stringify(sharableLinkConfig || {}));
        return sharableLinkConfig;
      }
      return JSON.parse(config as string) as Amity.ShareableLinkConfiguration;
    } catch (e) {
      localStorage.setItem('sharableLinkConfig', JSON.stringify({}));
      return {} as Amity.ShareableLinkConfiguration;
    }
  };

export const enum SharableModel {
  POST = 'posts',
  COMMUNITY = 'communities',
  USER = 'users',
  LIVESTREAM = 'livestream',
}

const REFERENCE_ID_MAP = Object.freeze({
  [SharableModel.POST]: 'postId',
  [SharableModel.COMMUNITY]: 'communityId',
  [SharableModel.USER]: 'userId',
  [SharableModel.LIVESTREAM]: 'livestream',
});

export const getShareableLink = async ({
  model,
  referenceId,
}: {
  model: SharableModel;
  referenceId: string;
}): Promise<string | undefined> => {
  const config = await getShareableLinkConfiguration();
  const domainConfig = config?.domain;
  const pathConfig = config?.patterns?.[model];

  if (!domainConfig || !pathConfig) return;
  return domainConfig + pathConfig.replace(`{${REFERENCE_ID_MAP[model]}}`, referenceId);
};
