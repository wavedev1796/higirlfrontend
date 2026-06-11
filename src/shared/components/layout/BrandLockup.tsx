/**
 * Shared — Brand lockup (logo + name).
 *
 * The Hi Girl logo image + wordmark used in login, register, and navbar.
 */

import React from "react";
import Image from "next/image";

interface BrandLockupProps {
  className?: string;
}

export const BrandLockup: React.FC<BrandLockupProps> = ({ className = "" }) => {
  return (
    <div className={`brand-lockup ${className}`}>
      <Image
        src="/logo-higirl.png"
        alt="Hi Girl logo"
        width={40}
        height={40}
        priority
      />
      <span>Hi Girl</span>
    </div>
  );
};
