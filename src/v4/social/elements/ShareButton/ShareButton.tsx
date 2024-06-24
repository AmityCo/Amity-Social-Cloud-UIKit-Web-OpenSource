import React from 'react';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import styles from './ShareButton.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';

const ShareSvg = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="16"
    viewBox="0 0 18 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M10.0625 7.09375H10.8594C11.291 7.09375 11.6562 7.45898 11.6562 7.89062V8.6875V9.65039L15.6406 6.03125L11.6562 2.44531V3.375V4.17188C11.6562 4.63672 11.291 4.96875 10.8594 4.96875H10.0625H6.34375C3.98633 4.96875 2.09375 6.89453 2.09375 9.21875C2.09375 9.75 2.12695 10.2148 2.25977 10.6133C2.82422 8.58789 4.65039 7.09375 6.875 7.09375H10.0625ZM10.0625 8.6875V8.7207H8.46875H6.875C5.11523 8.7207 3.6875 10.1484 3.6875 11.9082C3.6875 12.4727 3.82031 12.9043 3.98633 13.2363C4.05273 13.3359 4.08594 13.4023 4.15234 13.502C4.25195 13.6016 4.31836 13.7012 4.41797 13.7676C4.41797 13.8008 4.45117 13.8008 4.45117 13.834C4.61719 14 4.7168 14.1992 4.7168 14.4316C4.7168 14.7969 4.45117 15.0625 4.08594 15.0625C3.98633 15.0625 3.88672 15.0625 3.82031 15.0293C3.7207 14.9629 3.58789 14.8965 3.45508 14.7969C3.35547 14.7305 3.25586 14.6641 3.15625 14.5977C3.02344 14.498 2.89062 14.3984 2.75781 14.2988C1.76172 13.4355 0.5 11.8086 0.5 9.21875C0.5 5.99805 3.08984 3.375 6.34375 3.375H8.46875H10.0625V1.78125V1.25C10.0625 0.851562 10.2949 0.453125 10.6934 0.287109C11.0586 0.121094 11.5234 0.1875 11.8223 0.486328L17.1348 5.26758C17.3672 5.4668 17.5 5.73242 17.5 6.03125C17.5 6.36328 17.3672 6.62891 17.1348 6.82812L11.8223 11.6094C11.5234 11.9082 11.0586 11.9746 10.6934 11.8086C10.2949 11.6426 10.0625 11.2441 10.0625 10.8125V10.2812V8.6875Z" />
  </svg>
);

export interface ShareButtonProps {
  pageId?: string;
  componentId?: string;
  defaultIconClassName?: string;
  imgIconClassName?: string;
}

export function ShareButton({
  pageId = '*',
  componentId = '*',
  defaultIconClassName,
  imgIconClassName,
}: ShareButtonProps) {
  const elementId = 'share_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  // return (
  //   <div className={styles.shareButton} data-qa-anchor={accessibilityId} style={themeStyles}>
  //     <IconComponent
  //       defaultIcon={() => (
  //         <ShareSvg className={clsx(styles.shareButton__icon, defaultIconClassName)} />
  //       )}
  //       imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
  //       defaultIconName={defaultConfig.icon}
  //       configIconName={config.icon}
  //     />
  //     <Typography.BodyBold className={styles.shareButton__text}>{config.text}</Typography.BodyBold>
  //   </div>
  // );
  return null;
}
