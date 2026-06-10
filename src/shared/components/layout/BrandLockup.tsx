/**
 * Shared — Brand lockup (logo + name).
 *
 * The Hi Girl logo mark + wordmark used in login, register, and navbar.
 */

import React from "react";

interface BrandLockupProps {
  className?: string;
}

export const BrandLockup: React.FC<BrandLockupProps> = ({ className = "" }) => {
  return (
    <div className={`brand-lockup ${className}`}>
      <span className="logo-mark" aria-hidden="true">
        <span />
      </span>
      <span>Hi Girl</span>
    </div>
  );
};
