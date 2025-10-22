import React from "react";

interface NavigationButtonProps {
  onClick: () => void;
  disabled: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  onClick,
  disabled,
  title,
  children,
  className = "",
}) => {
  return (
    <button
      className={`nav-button-floating ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
};
