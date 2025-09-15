/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

/**
 * Renders the application's logo.
 * TODO: This is a placeholder icon. Replace with the final SVG logo.
 */
const LogoIcon = ({ width = 32, height = 32 }: { width?: number, height?: number }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    fill="none"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Monitor */}
    <rect x="2" y="7" width="20" height="12" rx="2" /> {/* Screen */}
    <line x1="12" y1="19" x2="12" y2="22" /> {/* Stand neck */}
    <line x1="8" y1="22" x2="16" y2="22" /> {/* Stand base */}
    
    {/* Graduation Cap */}
    <path d="M6 5.5L12 3L18 5.5L12 8L6 5.5Z" fill="currentColor" /> {/* Cap top */}
    <line x1="15" y1="6" x2="15" y2="9" /> {/* Tassel */}
  </svg>
);

export default LogoIcon;
