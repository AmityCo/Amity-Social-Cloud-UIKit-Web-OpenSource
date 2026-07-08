import { Client, AmitySharableContentType } from '@amityco/ts-sdk';

export const getShareableLinkConfiguration =
  async (): Promise<Amity.ShareableLinkConfiguration> => {
    return Client.getShareableLinkConfiguration();
  };

export const getShareableLink = async ({
  model,
  referenceId,
}: {
  model: AmitySharableContentType;
  referenceId: string;
}): Promise<string | undefined> => {
  const config = await getShareableLinkConfiguration();
  return config.generateLink(model, referenceId) ?? undefined;
};
