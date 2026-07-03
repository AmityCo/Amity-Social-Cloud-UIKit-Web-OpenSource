import styles from './CommunityPrivacyDescription.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';

type CommunityPrivacyDescriptionProps = {
  pageId?: string;
  componentId?: string;
  elementId: string;
  textId?: string;
};

export const CommunityPrivacyDescription = ({
  pageId = '*',
  componentId = '*',
  elementId,
  textId,
}: CommunityPrivacyDescriptionProps) => {
  const { isExcluded, config, accessibilityId, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <Typography.Caption
      data-testid={accessibilityId}
      className={styles.communityPrivacyDescription__text}
    >
      {textId ? resolveText(textId) : config.text}
    </Typography.Caption>
  );
};
