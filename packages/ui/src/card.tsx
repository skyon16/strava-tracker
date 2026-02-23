import { type JSX, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  className?: string;
  children: ReactNode;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({
  className,
  children,
  hover = false,
  onClick,
}: CardProps): JSX.Element {
  const baseStyles =
    "bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden";
  const hoverStyles = hover
    ? "hover:shadow-xl transition-shadow duration-200 cursor-pointer"
    : "";
  const interactiveStyles = onClick ? "cursor-pointer" : "";

  return (
    <div
      className={twMerge(baseStyles, hoverStyles, interactiveStyles, className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  className?: string;
  children: ReactNode;
}

export function CardHeader({
  className,
  children,
}: CardHeaderProps): JSX.Element {
  return (
    <div
      className={twMerge(
        "px-6 py-4 border-b border-gray-200 dark:border-gray-700",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface CardContentProps {
  className?: string;
  children: ReactNode;
}

export function CardContent({
  className,
  children,
}: CardContentProps): JSX.Element {
  return <div className={twMerge("p-6", className)}>{children}</div>;
}

interface CardTitleProps {
  className?: string;
  children: ReactNode;
}

export function CardTitle({
  className,
  children,
}: CardTitleProps): JSX.Element {
  return (
    <h3
      className={twMerge(
        "text-xl font-bold text-gray-900 dark:text-white",
        className,
      )}
    >
      {children}
    </h3>
  );
}
