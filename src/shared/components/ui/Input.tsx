/**
 * Shared UI — Input component.
 *
 * Renders a labelled input with optional leading icon, trailing action
 * (e.g. password-toggle button), and inline error message.
 */

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  /** Optional node rendered at the right side of the input (e.g. eye toggle). */
  trailingAction?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  trailingAction,
  className = "",
  id,
  ...props
}) => {
  return (
    <label className={className} htmlFor={id}>
      {label}
      <span
        className={[
          icon || trailingAction ? "input-with-icon" : "",
          trailingAction ? "has-trailing" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {icon}
        <input id={id} {...props} />
        {trailingAction && (
          <span className="input-trailing-action">{trailingAction}</span>
        )}
      </span>
      {error && <span className="error-message">{error}</span>}
    </label>
  );
};
