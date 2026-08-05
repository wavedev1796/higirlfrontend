/**
 * Shared UI — Toast notification component.
 *
 * Displays a temporary notification at the top of the viewport.
 */

"use client";

import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  detail?: string;
  variant?: "error" | "success";
  durationMs?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  detail,
  variant = "error",
  durationMs = 4000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onClose]);

  if (!visible) return null;

  const icon = variant === "success" ? "✓" : "!";

  return (
    <div
      className={`toast-notification ${variant}`}
      role="alert"
      aria-live="polite"
    >
      <span className="toast-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="toast-copy">
        <strong>{message}</strong>
        {detail && <span>{detail}</span>}
      </span>
      <button
        type="button"
        className="toast-close"
        aria-label="Cerrar notificación"
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
      >
        ×
      </button>
    </div>
  );
};
