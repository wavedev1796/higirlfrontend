/**
 * Shared UI — Input component.
 *
 * Renders a labelled input with optional leading icon and error message.
 */

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = "",
  ...props
}) => {
  return (
    <label className={className}>
      {label}
      <span className={icon ? "input-with-icon" : ""}>
        {icon}
        <input {...props} />
      </span>
      {error && <span className="error-message">{error}</span>}
    </label>
  );
};
