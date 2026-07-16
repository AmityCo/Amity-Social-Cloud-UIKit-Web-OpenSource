import React from 'react';

export const ExitPictureInPicture = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" {...props}>
      <g fill="none" fillRule="evenodd" opacity=".87">
        <path
          d="M18 4H4v10h14V4zm4 12V1.98C22 .88 21.1 0 20 0H2C.9 0 0 .88 0 1.98V16c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H2V1.97h18v14.05z"
          fill="currentColor"
          fillRule="nonzero"
        />
        <path d="M-1-3h24v24H-1z" />
      </g>
    </svg>
  );
};
