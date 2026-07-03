import styles from './CommunityPrivacyTitleOption.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components/Typography';

type CommunityPrivacyTitleOptionProps = {
  pageId?: string;
  componentId?: string;
  elementId: string;
  textId?: string;
};

export const CommunityPrivacyTitleOption = ({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  textId,
}: CommunityPrivacyTitleOptionProps) => {
  const { isExcluded, config, accessibilityId, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <Typography.BodyBold
      data-testid={accessibilityId}
      className={styles.communityPrivacyTitleOption__text}
    >
      {textId ? resolveText(textId) : config.text}
    </Typography.BodyBold>
  );
};
