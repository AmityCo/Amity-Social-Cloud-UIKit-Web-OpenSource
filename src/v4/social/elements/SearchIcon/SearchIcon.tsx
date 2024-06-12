import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';

const SearchIconSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M16.7109 14.6562C16.8672 14.8125 16.8672 15.0625 16.7109 15.1875L15.9922 15.9062C15.8672 16.0625 15.6172 16.0625 15.4609 15.9062L11.6797 12.125C11.6172 12.0312 11.5859 11.9375 11.5859 11.8438V11.4375C10.4297 12.4062 8.96094 13 7.33594 13C3.74219 13 0.835938 10.0938 0.835938 6.5C0.835938 2.9375 3.74219 0 7.33594 0C10.8984 0 13.8359 2.9375 13.8359 6.5C13.8359 8.125 13.2109 9.625 12.2422 10.75H12.6484C12.7422 10.75 12.8359 10.8125 12.9297 10.875L16.7109 14.6562ZM7.33594 11.5C10.0859 11.5 12.3359 9.28125 12.3359 6.5C12.3359 3.75 10.0859 1.5 7.33594 1.5C4.55469 1.5 2.33594 3.75 2.33594 6.5C2.33594 9.28125 4.55469 11.5 7.33594 11.5Z" />
  </svg>
);

export interface SearchIconProps {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
}

export function SearchIcon({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
}: SearchIconProps) {
  const elementId = 'search_icon';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <IconComponent
      defaultIcon={() => <SearchIconSvg className={defaultClassName} style={themeStyles} />}
      imgIcon={() => (
        <img src={config.icon} alt={uiReference} className={imgClassName} style={themeStyles} />
      )}
      defaultIconName={defaultConfig.icon}
      configIconName={config.icon}
    />
  );
}
