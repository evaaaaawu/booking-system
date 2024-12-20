import type { ButtonHTMLAttributes, ReactNode } from "react";
import classNames from "classnames";

type ButtonVariant = "primary" | "secondary" | "white";
type ButtonSize = "xs" | "sm" | "default" | "lg" | "xl" | "wide";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isSubmit?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "default",
  isSubmit = true,
  children,
  className,
  ...props
}: ButtonProps): JSX.Element {
  const baseClasses =
    "inline-flex items-center border border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary:
      "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500",
    white:
      "text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500 border-gray-300",
  };

  const sizeClasses = {
    xs: "px-2.5 py-1.5 text-xs font-medium rounded",
    sm: "px-3 py-2 text-sm leading-4 font-medium rounded-md",
    default: "px-4 py-2 text-sm font-medium rounded-md",
    lg: "px-4 py-2 text-base font-medium rounded-md",
    xl: "px-6 py-3 text-base font-medium rounded-md",
    wide: "w-full text-center px-4 py-2 text-sm font-medium rounded-md",
  };

  const combinedClasses = classNames(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  return (
    <button className={combinedClasses} type={isSubmit ? "submit" : "button"} {...props}>
      {children}
    </button>
  );
}
