import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" |"success";
  size?: "sm" | "md" | "lg" | "icon";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const buttonClass = `btn btn--${variant} ${
    size !== "md" ? `btn--${size}` : ""
  } ${className}`.trim();

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
}
