import React from 'react';

const PartyHorn = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M19.9701 1.50083C20.2561 1.21483 20.6641 1.10483 21.0531 1.21183C21.4421 1.31883 21.7411 1.62883 21.8371 2.02083L22.9571 6.58083C23.0531 6.97383 22.9321 7.38983 22.6381 7.66683L14.3531 15.4688L9.51807 10.6328L19.9701 1.50083Z"
      fill={props.fill ?? 'currentColor'}
    />
    <path
      d="M8.10608 12.0469L12.9421 16.8829L9.88808 19.7519C9.46008 20.1549 8.85708 20.2999 8.29408 20.1339L3.83108 18.8109C3.26808 18.6449 2.84408 18.1769 2.73108 17.5999L2.01708 13.9819C1.90408 13.4049 2.12408 12.8139 2.58308 12.4479L5.27808 10.3629L8.10608 12.0469Z"
      fill={props.fill ?? 'currentColor'}
    />
    <path
      d="M2 22L5.5 18.5"
      stroke={props.fill ?? 'currentColor'}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="19" cy="5" r="1" fill={props.fill ?? 'currentColor'} />
    <circle cx="17" cy="3" r="0.75" fill={props.fill ?? 'currentColor'} />
    <circle cx="21" cy="3" r="0.75" fill={props.fill ?? 'currentColor'} />
  </svg>
);

export default PartyHorn;
