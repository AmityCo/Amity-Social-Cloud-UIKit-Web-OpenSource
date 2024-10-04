import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';

interface CommunityEmptyImageProps {
  pageId?: string;
  componentId?: string;
}

export const CommunityEmptyImage = ({
  pageId = '*',
  componentId = '*',
}: CommunityEmptyImageProps) => {
  const elementId = 'community_empty_image';

  const { config, accessibilityId, isExcluded, uiReference, defaultConfig } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <IconComponent
      data-qa-anchor={accessibilityId}
      defaultIcon={() => (
        <svg
          width="55"
          height="45"
          viewBox="0 0 55 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.9375 0.3125C9.78125 0.3125 10.625 1.15625 10.625 2V8.75C10.625 9.69922 9.78125 10.4375 8.9375 10.4375H2.1875C1.23828 10.4375 0.5 9.69922 0.5 8.75V2C0.5 1.15625 1.23828 0.3125 2.1875 0.3125H8.9375ZM8.9375 17.1875C9.78125 17.1875 10.625 18.0312 10.625 18.875V25.625C10.625 26.5742 9.78125 27.3125 8.9375 27.3125H2.1875C1.23828 27.3125 0.5 26.5742 0.5 25.625V18.875C0.5 18.0312 1.23828 17.1875 2.1875 17.1875H8.9375ZM8.9375 34.0625C9.78125 34.0625 10.625 34.9062 10.625 35.75V42.5C10.625 43.4492 9.78125 44.1875 8.9375 44.1875H2.1875C1.23828 44.1875 0.5 43.4492 0.5 42.5V35.75C0.5 34.9062 1.23828 34.0625 2.1875 34.0625H8.9375ZM52.8125 19.7188C53.6562 19.7188 54.5 20.5625 54.5 21.4062V23.0938C54.5 24.043 53.6562 24.7812 52.8125 24.7812H19.0625C18.1133 24.7812 17.375 24.043 17.375 23.0938V21.4062C17.375 20.5625 18.1133 19.7188 19.0625 19.7188H52.8125ZM52.8125 36.5938C53.6562 36.5938 54.5 37.4375 54.5 38.2812V39.9688C54.5 40.918 53.6562 41.6562 52.8125 41.6562H19.0625C18.1133 41.6562 17.375 40.918 17.375 39.9688V38.2812C17.375 37.4375 18.1133 36.5938 19.0625 36.5938H52.8125ZM52.8125 2.84375C53.6562 2.84375 54.5 3.6875 54.5 4.53125V6.21875C54.5 7.16797 53.6562 7.90625 52.8125 7.90625H19.0625C18.1133 7.90625 17.375 7.16797 17.375 6.21875V4.53125C17.375 3.6875 18.1133 2.84375 19.0625 2.84375H52.8125Z"
            fill="#EBECEF"
          />
        </svg>
      )}
      imgIcon={() => <img src={config.icon} alt={uiReference} />}
      configIconName={config.icon}
      defaultIconName={defaultConfig.icon}
    />
  );
};
