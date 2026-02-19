import React from 'react';

export interface ButtonProps {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use */
  backgroundColor?: string;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button contents */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
}

const sizeClasses = {
  small: 'px-4 py-[10px] text-xs',
  medium: 'px-5 py-[11px] text-sm',
  large: 'px-6 py-3 text-base',
};

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const modeClasses = primary
    ? 'bg-[#555ab9] text-white'
    : 'shadow-[rgba(0,0,0,0.15)_0px_0px_0px_1px_inset] bg-transparent text-[#333]';
  return (
    <button
      type="button"
      className={`inline-block cursor-pointer border-0 rounded-full font-bold leading-none font-sans ${sizeClasses[size]} ${modeClasses}`}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};
