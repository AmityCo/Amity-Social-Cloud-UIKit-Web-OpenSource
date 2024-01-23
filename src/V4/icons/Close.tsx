import React from 'react';

function Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path
        fill="inherit"
        d="M13.652 12.25l3.797 3.797a.596.596 0 010 .808l-.879.88a.596.596 0 01-.808 0L12 13.937l-3.797 3.796a.596.596 0 01-.808 0l-.88-.879a.596.596 0 010-.808l3.798-3.797-3.797-3.762a.596.596 0 010-.808l.879-.88c.21-.21.597-.21.808 0L12 10.599 15.762 6.8a.596.596 0 01.808 0l.88.879a.596.596 0 010 .808l-3.798 3.762z"
      ></path>
    </svg>
  );
}

export default Icon;
