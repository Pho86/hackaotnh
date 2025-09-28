import React from "react";
import { twMerge } from "tailwind-merge";

export default function Button({
  children,
  variant = "default",
  disabled = false,
  active = false,
  className,
  type = "button",
  ...props
}) {
  const baseClasses =
    "w-max h-[51.4px] px-[24.4px] py-[12.2px] rounded-[30px] flex items-center gap-[6px] font-medium text-sm cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 opacity-100";

  let variantClasses = "";
  if (active) {
    variantClasses =
      "text-white border-2 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] focus:ring-blue-500";
  } else if (variant === "success") {
    variantClasses =
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500";
  } else if (variant === "danger") {
    variantClasses =
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";
  } else {
    variantClasses =
      "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500";
  }

  if (disabled) {
    variantClasses += " opacity-50 cursor-not-allowed";
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={twMerge(baseClasses, variantClasses, className)}
      {...props}
    >
      {children}
    </button>
  );
}
