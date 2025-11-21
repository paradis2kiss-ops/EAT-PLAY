import React from 'react';

export const PotionIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#E3F2FD', stopOpacity: 0.6 }} />
          <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.1)' }} />
        </linearGradient>
        <linearGradient id="bottomLiquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFE0B2' }} />
          <stop offset="100%" style={{ stopColor: '#FFF9C4' }} />
        </linearGradient>
        <linearGradient id="topLiquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#80CBC4' }} />
          <stop offset="100%" style={{ stopColor: '#B2DFDB' }} />
        </linearGradient>
        <filter id="sparkleGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="liquidClip">
          <path d="M 50,25 C 25,25 20,40 20,55 A 30 30 0 1 0 80 55 C 80,40 75,25 50,25 Z" />
        </clipPath>
      </defs>
      <g>
        <g clipPath="url(#liquidClip)">
          <rect x="20" y="30" width="60" height="38" fill="url(#topLiquidGradient)" />
          <rect x="20" y="68" width="60" height="22" fill="url(#bottomLiquidGradient)" />
          <text x="35" y="60" fontSize="18" textAnchor="middle">🥬</text>
          <text x="65" y="82" fontSize="18" textAnchor="middle">🍩</text>
        </g>
        <g transform="translate(0, 68)" filter="url(#sparkleGlow)">
          <path d="M 28 0 l 1.5 -3 l 1.5 3 l 3 1.5 l -3 1.5 l -1.5 3 l -1.5 -3 l -3 -1.5 z" fill="#FF8A80" />
          <path d="M 72 0 l 2 -4 l 2 4 l 4 2 l -4 2 l -2 4 l -2 -4 l -4 -2 z" fill="#4DB6AC" />
          <circle cx="50" cy="0" r="2" fill="#FFD54F" />
        </g>
        <path d="M 50,25 C 25,25 20,40 20,55 A 30 30 0 1 0 80 55 C 80,40 75,25 50,25 Z" fill="url(#glassGradient)" />
        <path d="M 50,25 C 25,25 20,40 20,55 A 30 30 0 1 0 80 55 C 80,40 75,25 50,25 Z" fill="none" stroke="#E3F2FD" strokeWidth="2" strokeOpacity="0.9" />
        <path d="M 43,15 C 43,10 57,10 57,15 L 57,25 L 43,25 Z" fill="#A1887F" stroke="#795548" strokeWidth="1"/>
        <path d="M 30 50 A 20 20 0 0 1 50 35" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7"/>
      </g>
    </svg>
  );
};
