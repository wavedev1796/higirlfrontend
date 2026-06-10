/**
 * Shared — Field icon SVG components.
 *
 * Extracted from RegisterForm to be reusable across features.
 */

import React from "react";

type IconName = "user" | "mail" | "lock";

const iconPaths: Record<IconName, React.ReactNode> = {
  user: (
    <>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  mail: (
    <>
      <rect width="18" height="14" x="3" y="5" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  lock: (
    <>
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
};

interface FieldIconProps {
  name: IconName;
  size?: number;
}

export const FieldIcon: React.FC<FieldIconProps> = ({ name, size = 20 }) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      >
        {iconPaths[name]}
      </g>
    </svg>
  );
};
