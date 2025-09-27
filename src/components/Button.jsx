import React from "react";
import clsx from "clsx";

const Button = ({
  children,
  variant = "default",
  disabled = false,
  className,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        "h-11 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
        {
          "opacity-50 cursor-not-allowed": disabled,
          "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500":
            variant === "default" && !disabled,
          "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500":
            variant === "success" && !disabled,
          "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500":
            variant === "danger" && !disabled,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
