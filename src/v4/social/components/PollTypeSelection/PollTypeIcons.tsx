import { useTheme } from '~/v4/core/providers/ThemeProvider';
import { getCssVariableValue } from '~/v4/helpers/utils';

export const TextPollSvg = ({ isActive = false, ...props }) => {
  const { currentTheme } = useTheme();
  const isDarkTheme = currentTheme === 'dark';

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 166 184"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        width="165.5"
        height="184"
        fill={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade3')
            : getCssVariableValue('--asc-color-base-shade4')
        }
      />
      <path
        d="M35.1201 52.1973H122.966C123.966 52.1973 124.777 53.0091 124.777 54.0098V66.4736C124.777 67.4743 123.966 68.2851 122.966 68.2852H35.1201C34.1195 68.2852 33.3076 67.4743 33.3076 66.4736V54.0098C33.3076 53.0091 34.1195 52.1973 35.1201 52.1973Z"
        fill="white"
      />
      <path
        d="M35.1201 52.1973H122.966C123.966 52.1973 124.777 53.0091 124.777 54.0098V66.4736C124.777 67.4743 123.966 68.2851 122.966 68.2852H35.1201C34.1195 68.2852 33.3076 67.4743 33.3076 66.4736V54.0098C33.3076 53.0091 34.1195 52.1973 35.1201 52.1973Z"
        stroke={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue('--asc-color-base-shade4')
        }
        strokeWidth="1.20789"
      />
      <rect
        x="37.5356"
        y="58.4297"
        width="66.4338"
        height="3.62366"
        rx="1.81183"
        fill={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-default' : '--asc-color-base-shade4',
              )
        }
      />
      <path
        d="M116.322 56.6174C118.324 56.6174 119.946 58.2402 119.946 60.2415C119.946 62.2427 118.324 63.8655 116.322 63.8655C114.321 63.8654 112.698 62.2427 112.698 60.2415C112.698 58.2402 114.321 56.6175 116.322 56.6174Z"
        stroke={
          isActive
            ? getCssVariableValue('--asc-color-primary-default')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-shade1' : '--asc-color-base-shade3',
              )
        }
        strokeWidth="1.20789"
      />
      <path
        d="M47.5264 72.9531H135.372C136.373 72.9531 137.184 73.765 137.184 74.7656V87.2295C137.184 88.2301 136.373 89.041 135.372 89.041H47.5264C46.5257 89.041 45.7139 88.2301 45.7139 87.2295V74.7656C45.7139 73.765 46.5257 72.9531 47.5264 72.9531Z"
        fill="white"
      />
      <path
        d="M47.5264 72.9531H135.372C136.373 72.9531 137.184 73.765 137.184 74.7656V87.2295C137.184 88.2301 136.373 89.041 135.372 89.041H47.5264C46.5257 89.041 45.7139 88.2301 45.7139 87.2295V74.7656C45.7139 73.765 46.5257 72.9531 47.5264 72.9531Z"
        stroke={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue('--asc-color-base-shade4')
        }
        strokeWidth="1.20789"
      />
      <rect
        x="49.9419"
        y="79.1855"
        width="66.4338"
        height="3.62366"
        rx="1.81183"
        fill={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-default' : '--asc-color-base-shade4',
              )
        }
      />
      <path
        d="M128.719 85.225C131.054 85.225 132.946 83.3322 132.946 80.9974C132.946 78.6625 131.054 76.7698 128.719 76.7698C126.384 76.7698 124.491 78.6625 124.491 80.9974C124.491 83.3322 126.384 85.225 128.719 85.225Z"
        fill={
          isActive
            ? getCssVariableValue('--asc-color-primary-default')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-shade1' : '--asc-color-base-shade3',
              )
        }
      />
      <path
        d="M130.635 79.1651C130.688 79.112 130.773 79.112 130.815 79.1651L131.123 79.4623C131.165 79.5154 131.165 79.6003 131.123 79.6428L127.938 82.8276C127.885 82.8807 127.811 82.8807 127.758 82.8276L126.335 81.4157C126.293 81.3626 126.293 81.2777 126.335 81.2352L126.643 80.9273C126.685 80.8849 126.77 80.8849 126.823 80.9273L127.843 81.9571L130.635 79.1651Z"
        fill="white"
      />
      <path
        d="M29.1709 93.7073H117.017C118.017 93.7073 118.828 94.5191 118.828 95.5198V107.984C118.828 108.984 118.017 109.795 117.017 109.795H29.1709C28.1703 109.795 27.3584 108.984 27.3584 107.984V95.5198C27.3584 94.5191 28.1703 93.7073 29.1709 93.7073Z"
        fill="white"
      />
      <path
        d="M29.1709 93.7073H117.017C118.017 93.7073 118.828 94.5191 118.828 95.5198V107.984C118.828 108.984 118.017 109.795 117.017 109.795H29.1709C28.1703 109.795 27.3584 108.984 27.3584 107.984V95.5198C27.3584 94.5191 28.1703 93.7073 29.1709 93.7073Z"
        stroke={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue('--asc-color-base-shade4')
        }
        strokeWidth="1.20789"
      />
      <rect
        x="31.5864"
        y="99.9399"
        width="66.4338"
        height="3.62366"
        rx="1.81183"
        fill={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-default' : '--asc-color-base-shade4',
              )
        }
      />
      <path
        d="M110.373 98.1274C112.374 98.1274 113.997 99.7502 113.997 101.751C113.997 103.753 112.374 105.375 110.373 105.375C108.372 105.375 106.749 103.753 106.749 101.751C106.749 99.7502 108.372 98.1275 110.373 98.1274Z"
        stroke={
          isActive
            ? getCssVariableValue('--asc-color-primary-default')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-shade1' : '--asc-color-base-shade3',
              )
        }
        strokeWidth="1.20789"
      />
      <path
        d="M47.5264 114.242H135.372C136.373 114.242 137.184 115.054 137.184 116.055V128.519C137.184 129.519 136.373 130.33 135.372 130.33H47.5264C46.5257 130.33 45.7139 129.519 45.7139 128.519V116.055C45.7139 115.054 46.5257 114.242 47.5264 114.242Z"
        fill="white"
      />
      <path
        d="M47.5264 114.242H135.372C136.373 114.242 137.184 115.054 137.184 116.055V128.519C137.184 129.519 136.373 130.33 135.372 130.33H47.5264C46.5257 130.33 45.7139 129.519 45.7139 128.519V116.055C45.7139 115.054 46.5257 114.242 47.5264 114.242Z"
        stroke={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue('--asc-color-base-shade4')
        }
        strokeWidth="1.20789"
      />
      <rect
        x="49.9419"
        y="120.475"
        width="66.4338"
        height="3.62366"
        rx="1.81183"
        fill={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-default' : '--asc-color-base-shade4',
              )
        }
      />
      <path
        d="M128.729 118.662C130.73 118.662 132.353 120.285 132.353 122.286C132.353 124.288 130.73 125.91 128.729 125.91C126.727 125.91 125.104 124.288 125.104 122.286C125.105 120.285 126.727 118.662 128.729 118.662Z"
        stroke={
          isActive
            ? getCssVariableValue('--asc-color-primary-default')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-shade1' : '--asc-color-base-shade3',
              )
        }
        strokeWidth="1.20789"
      />
    </svg>
  );
};

export const ImagePollSvg = ({ isActive = false, ...props }) => {
  const { currentTheme } = useTheme();
  const isDarkTheme = currentTheme === 'dark';

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 166 184"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        width="165.5"
        height="184"
        transform="translate(0.5)"
        fill={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade3')
            : getCssVariableValue('--asc-color-base-shade4')
        }
      />
      <path
        d="M28.459 50.2646H79.3398C80.2727 50.2648 81.0293 51.0212 81.0293 51.9541V88.7363C81.0293 89.6693 80.2728 90.4256 79.3398 90.4258H28.459C27.526 90.4258 26.7695 89.6694 26.7695 88.7363V51.9541C26.7695 51.0211 27.526 50.2646 28.459 50.2646Z"
        fill="white"
      />
      <path
        d="M28.459 50.2646H79.3398C80.2727 50.2648 81.0293 51.0212 81.0293 51.9541V88.7363C81.0293 89.6693 80.2728 90.4256 79.3398 90.4258H28.459C27.526 90.4258 26.7695 89.6694 26.7695 88.7363V51.9541C26.7695 51.0211 27.526 50.2646 28.459 50.2646Z"
        stroke={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue('--asc-color-base-shade4')
        }
        strokeWidth="1.12626"
      />
      <rect
        x="30.7109"
        y="54.2063"
        width="46.3759"
        height="24.1685"
        rx="2.01404"
        fill={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-default' : '--asc-color-base-shade4',
              )
        }
      />
      <path
        d="M70.9062 57.7913C72.7721 57.7915 74.2842 59.3043 74.2842 61.1702C74.2839 63.0359 72.7719 64.5478 70.9062 64.5481C69.0403 64.5481 67.5276 63.036 67.5273 61.1702C67.5273 59.3041 69.0402 57.7913 70.9062 57.7913Z"
        stroke={
          isActive
            ? getCssVariableValue('--asc-color-primary-default')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-shade1' : '--asc-color-base-shade3',
              )
        }
        strokeWidth="1.12626"
      />
      <rect
        x="30.7109"
        y="82.4558"
        width="28.1965"
        height="4.02808"
        rx="2.01404"
        fill={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-default' : '--asc-color-base-shade4',
              )
        }
      />
      <path
        d="M28.459 94.5735H79.3398C80.2727 94.5736 81.0293 95.33 81.0293 96.2629V133.045C81.0293 133.978 80.2728 134.734 79.3398 134.735H28.459C27.526 134.735 26.7695 133.978 26.7695 133.045V96.2629C26.7695 95.3299 27.526 94.5735 28.459 94.5735Z"
        fill="white"
      />
      <path
        d="M28.459 94.5735H79.3398C80.2727 94.5736 81.0293 95.33 81.0293 96.2629V133.045C81.0293 133.978 80.2728 134.734 79.3398 134.735H28.459C27.526 134.735 26.7695 133.978 26.7695 133.045V96.2629C26.7695 95.3299 27.526 94.5735 28.459 94.5735Z"
        stroke={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue('--asc-color-base-shade4')
        }
        strokeWidth="1.12626"
      />
      <rect
        x="30.7109"
        y="98.5149"
        width="46.3759"
        height="24.1685"
        rx="2.01404"
        fill={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-default' : '--asc-color-base-shade4',
              )
        }
      />
      <path
        d="M70.9062 102.1C72.7721 102.1 74.2842 103.613 74.2842 105.479C74.2839 107.344 72.7719 108.856 70.9062 108.856C69.0403 108.856 67.5276 107.344 67.5273 105.479C67.5273 103.612 69.0402 102.1 70.9062 102.1Z"
        stroke={
          isActive
            ? getCssVariableValue('--asc-color-primary-default')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-shade1' : '--asc-color-base-shade3',
              )
        }
        strokeWidth="1.12626"
      />
      <rect
        x="30.7109"
        y="126.765"
        width="28.1965"
        height="4.02808"
        rx="2.01404"
        fill={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-default' : '--asc-color-base-shade4',
              )
        }
      />
      <path
        d="M86.8667 94.5735H137.748C138.68 94.5736 139.437 95.33 139.437 96.2629V133.045C139.437 133.978 138.68 134.734 137.748 134.735H86.8667C85.9337 134.735 85.1772 133.978 85.1772 133.045V96.2629C85.1772 95.3299 85.9337 94.5735 86.8667 94.5735Z"
        fill="white"
      />
      <path
        d="M86.8667 94.5735H137.748C138.68 94.5736 139.437 95.33 139.437 96.2629V133.045C139.437 133.978 138.68 134.734 137.748 134.735H86.8667C85.9337 134.735 85.1772 133.978 85.1772 133.045V96.2629C85.1772 95.3299 85.9337 94.5735 86.8667 94.5735Z"
        stroke={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue('--asc-color-base-shade4')
        }
        strokeWidth="1.12626"
      />
      <rect
        x="89.1191"
        y="98.5149"
        width="46.3759"
        height="24.1685"
        rx="2.01404"
        fill={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-default' : '--asc-color-base-shade4',
              )
        }
      />
      <path
        d="M129.313 102.1C131.179 102.1 132.691 103.613 132.691 105.479C132.691 107.344 131.179 108.856 129.313 108.856C127.448 108.856 125.935 107.344 125.935 105.479C125.935 103.612 127.447 102.1 129.313 102.1Z"
        stroke={
          isActive
            ? getCssVariableValue('--asc-color-primary-default')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-shade1' : '--asc-color-base-shade3',
              )
        }
        strokeWidth="1.12626"
      />
      <rect
        x="89.1191"
        y="126.764"
        width="28.1965"
        height="4.02808"
        rx="2.01404"
        fill={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-default' : '--asc-color-base-shade4',
              )
        }
      />
      <path
        d="M86.8667 50.2646H137.748C138.68 50.2648 139.437 51.0212 139.437 51.9541V88.7363C139.437 89.6693 138.68 90.4256 137.748 90.4258H86.8667C85.9337 90.4258 85.1772 89.6694 85.1772 88.7363V51.9541C85.1772 51.0211 85.9337 50.2646 86.8667 50.2646Z"
        fill="white"
      />
      <path
        d="M86.8667 50.2646H137.748C138.68 50.2648 139.437 51.0212 139.437 51.9541V88.7363C139.437 89.6693 138.68 90.4256 137.748 90.4258H86.8667C85.9337 90.4258 85.1772 89.6694 85.1772 88.7363V51.9541C85.1772 51.0211 85.9337 50.2646 86.8667 50.2646Z"
        stroke={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-shade1' : '--asc-color-base-shade3',
              )
        }
        strokeWidth="1.12626"
      />
      <rect
        x="89.1191"
        y="54.2063"
        width="46.3759"
        height="24.1685"
        rx="2.01404"
        fill={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-default' : '--asc-color-base-shade4',
              )
        }
      />
      <path
        d="M129.257 65.5003C131.434 65.5003 133.199 63.7354 133.199 61.5584C133.199 59.3813 131.434 57.6165 129.257 57.6165C127.08 57.6165 125.315 59.3813 125.315 61.5584C125.315 63.7354 127.08 65.5003 129.257 65.5003Z"
        fill={
          isActive
            ? getCssVariableValue('--asc-color-primary-default')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-shade1' : '--asc-color-base-shade3',
              )
        }
      />
      <path
        d="M131.044 59.8508C131.093 59.8013 131.172 59.8013 131.212 59.8508L131.499 60.128C131.539 60.1775 131.539 60.2567 131.499 60.2963L128.529 63.2659C128.48 63.3154 128.411 63.3154 128.361 63.2659L127.035 61.9494C126.995 61.8999 126.995 61.8207 127.035 61.7811L127.322 61.494C127.361 61.4544 127.44 61.4544 127.49 61.494L128.44 62.4542L131.044 59.8508Z"
        fill="white"
      />
      <rect
        x="89.1191"
        y="82.4558"
        width="28.1965"
        height="4.02808"
        rx="2.01404"
        fill={
          isActive
            ? getCssVariableValue('--asc-color-primary-shade2')
            : getCssVariableValue(
                isDarkTheme ? '--asc-color-base-default' : '--asc-color-base-shade4',
              )
        }
      />
    </svg>
  );
};
