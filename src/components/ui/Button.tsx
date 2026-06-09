import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading,
  className = "",
  disabled,
  ...props
}) => {
  const baseClass = variant === "primary" ? "primary-button" : "secondary-button";
  
  return (
    <button
      className={`${baseClass} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? "Cargando..." : children}
    </button>
  );
};
