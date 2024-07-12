import React from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import styles from './CreateStoryButton.module.css';
import clsx from 'clsx';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';

const CreateStoryButtonSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="17" height="18" viewBox="0 0 17 18" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.771159 12.2248C1.00906 12.7861 1.30474 13.3088 1.65819 13.7927C1.85468 14.0618 2.2428 14.0749 2.47778 13.8387L2.85238 13.4622C3.05585 13.2578 3.07242 12.9352 2.91359 12.6944C2.68511 12.3479 2.4918 11.9785 2.33366 11.5862C2.17162 11.1841 2.04651 10.7654 1.95831 10.33C1.90156 10.0497 1.66209 9.83785 1.37619 9.83785H0.7981C0.460143 9.83785 0.194237 10.1301 0.252477 10.463C0.359316 11.0737 0.53221 11.661 0.771159 12.2248ZM0.791992 5.77587C0.565717 6.33406 0.392758 6.91522 0.273115 7.51935C0.206005 7.85821 0.473794 8.1628 0.819238 8.1628H1.37619C1.66209 8.1628 1.90156 7.95091 1.95831 7.6707C2.04651 7.23526 2.17162 6.81652 2.33366 6.41448C2.4918 6.0221 2.68511 5.6527 2.91359 5.30628C3.07242 5.06546 3.05585 4.7429 2.85238 4.53841L2.47778 4.16192C2.2428 3.92576 1.85456 3.93884 1.65906 4.2086C1.30847 4.69235 1.01944 5.21477 0.791992 5.77587ZM5.26074 16.7265C5.81526 16.966 6.39491 17.1396 6.9997 17.247C7.33267 17.3061 7.62533 17.0401 7.62533 16.7019V16.1571C7.62533 15.8715 7.41372 15.6325 7.13436 15.5731C6.70488 15.4817 6.29562 15.3497 5.90658 15.177C5.52127 15.0061 5.14859 14.8025 4.78852 14.5662C4.5475 14.4081 4.22544 14.4327 4.02574 14.6406L3.64108 15.041C3.40868 15.2829 3.43286 15.6735 3.7084 15.8649C4.19354 16.2017 4.71098 16.4889 5.26074 16.7265ZM3.71752 2.12947C3.43846 2.32272 3.41731 2.71924 3.65673 2.95986L4.05715 3.36229C4.26214 3.56831 4.58771 3.58533 4.82847 3.42255C5.1704 3.19137 5.53324 2.99173 5.91699 2.82361C6.3137 2.64981 6.73277 2.5172 7.17418 2.42577C7.45449 2.3677 7.66699 2.12833 7.66699 1.84207V1.29669C7.66699 0.959243 7.37557 0.693429 7.04294 0.750218C6.41529 0.857371 5.82122 1.03203 5.26074 1.27419C4.71443 1.51024 4.20002 1.79533 3.71752 2.12947ZM9.82271 15.5735C9.54395 15.6315 9.33366 15.8703 9.33366 16.155V16.6953C9.33366 17.0359 9.63023 17.3024 9.96541 17.2422C11.8264 16.908 13.4005 16.0311 14.6878 14.6117C16.1184 13.0344 16.8337 11.1639 16.8337 9.00033C16.8337 6.83673 16.1184 4.96627 14.6878 3.38894C13.4005 1.96952 11.8264 1.09268 9.96541 0.758409C9.63023 0.698204 9.33366 0.964784 9.33366 1.30532V1.84562C9.33366 2.13035 9.54395 2.36916 9.82271 2.42716C11.2862 2.73166 12.5155 3.45008 13.5107 4.5824C14.6149 5.83868 15.167 7.31132 15.167 9.00033C15.167 10.6893 14.6149 12.162 13.5107 13.4182C12.5155 14.5506 11.2862 15.269 9.82271 15.5735Z"
    />
    <path d="M12.7189 8.47933C12.9012 8.47933 13.0835 8.66162 13.0835 8.84391V9.57308C13.0835 9.77816 12.9012 9.93766 12.7189 9.93766H9.43766V13.2189C9.43766 13.424 9.25537 13.5835 9.07308 13.5835H8.34391C8.13883 13.5835 7.97933 13.424 7.97933 13.2189V9.93766H4.69808C4.493 9.93766 4.3335 9.77816 4.3335 9.57308V8.84391C4.3335 8.66162 4.493 8.47933 4.69808 8.47933H7.97933V5.19808C7.97933 5.01579 8.13883 4.8335 8.34391 4.8335H9.07308C9.25537 4.8335 9.43766 5.01579 9.43766 5.19808V8.47933H12.7189Z" />
  </svg>
);

interface CreateStoryButtonProps {
  pageId?: string;
  componentId: string;
  onClick?: (e: React.MouseEvent) => void;
  defaultClassName?: string;
}

export function CreateStoryButton({
  pageId = '*',
  componentId = '*',
  onClick,
  defaultClassName,
}: CreateStoryButtonProps) {
  const elementId = 'create_story_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });
  const { AmityCreatePostMenuComponentBehavior } = usePageBehavior();

  if (isExcluded) return null;
  return (
    <div
      className={styles.createStoryButton}
      onClick={() => AmityCreatePostMenuComponentBehavior.goToStoryTargetSelectionPage()}
      data-qa-anchor={accessibilityId}
      style={themeStyles}
    >
      <IconComponent
        defaultIcon={() => (
          <CreateStoryButtonSvg
            className={clsx(styles.createStoryButton__icon, defaultClassName)}
          />
        )}
        imgIcon={() => <img src={config.image} alt={uiReference} />}
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
      />
      <Typography.Body className={styles.createStoryButton__text}>{config.text}</Typography.Body>
    </div>
  );
}

export default CreateStoryButton;
