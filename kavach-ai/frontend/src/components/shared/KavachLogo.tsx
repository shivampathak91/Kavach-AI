import React from 'react'

interface KavachLogoProps {
  size?: number
  className?: string
}

export default function KavachLogo({ size = 32, className = '' }: KavachLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M50 5 L90 22 V55 C90 75 75 90 50 95 C25 90 10 75 10 55 V22 L50 5Z" fill="url(#shieldGlow)" opacity={0.15} />
      <path d="M50 8 L86 24 V53 C86 71 73 85 50 90 C27 85 14 71 14 53 V24 L50 8Z" stroke="url(#shieldGrad)" strokeWidth={4} strokeLinejoin="round" />
      <path d="M50 16 L78 28 V49 C78 64 67 76 50 80 C33 76 22 64 22 49 V28 L50 16Z" stroke="currentColor" strokeWidth={1.5} strokeOpacity={0.3} />
      <path d="M38 32 V68 M38 50 L56 32 M38 50 L58 68" stroke="url(#kGrad)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={56} cy={32} r={3.5} fill="#22d3ee" />
      <circle cx={58} cy={68} r={3.5} fill="#8b5cf6" />
      <circle cx={38} cy={50} r={3.5} fill="#6366f1" />
      <defs>
        <linearGradient id="shieldGrad" x1={50} y1={8} x2={50} y2={90} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="shieldGlow" x1={50} y1={5} x2={50} y2={95} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="kGrad" x1={38} y1={32} x2={58} y2={68} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
      </defs>
    </svg>
  )
}
