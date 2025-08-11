import React from 'react';
import { Typography } from '~/v4/core/components';

interface PercentageCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const PercentageCircle: React.FC<PercentageCircleProps> = ({
  percentage,
  size = 63,
  strokeWidth = 5,
  className,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const center = size / 2;

  return (
    <div className={className} style={{ position: 'relative', display: 'inline-block' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#D3D3D3"
          strokeOpacity="0.3"
          strokeWidth={strokeWidth}
          fill="none"
        />

        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.3s ease',
            transform: 'rotate(-90deg)',
            transformOrigin: `${center}px ${center}px`,
          }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCCB2F" />
            <stop offset="50%" stopColor="#F3E63C" />
            <stop offset="100%" stopColor="#D4EC46" />
          </linearGradient>
        </defs>
      </svg>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      >
        <Typography.Body style={{ fontWeight: 'bold', fontSize: '14px' }}>
          {Math.round(percentage)}%
        </Typography.Body>
      </div>
    </div>
  );
};
