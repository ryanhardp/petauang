import React from 'react';

export default function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      className={className}
    >
      {/* Background Hitam */}
      <rect width="120" height="120" fill="#0a0a0a" rx="8" />

      {/* Shape Abu-abu Gelap (Pill Shape) */}
      <path 
        d="M120 30 H 60 A 30 30 0 0 0 60 90 H 120 Z" 
        fill="#1c1c1e" 
      />

      {/* Kotak Kuning Rounded */}
      <rect 
        x="65" 
        y="42" 
        width="36" 
        height="36" 
        rx="8" 
        fill="#f5a623" 
      />

      {/* Huruf P */}
      <text
        x="83"
        y="64"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontSize="24"
        fill="#000"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        P
      </text>
    </svg>
  );
}