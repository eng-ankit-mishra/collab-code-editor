import type { ReactNode } from "react";
import type { JSX } from "react";
// Optional but great for conditional classes

type ButtonProps = {
  children?: ReactNode;
  isTransparent?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function Button({
  children,
  isTransparent = false,
  className = "",
  onClick,
  type = "submit",
  disabled = false,
}: ButtonProps): JSX.Element {
  return (
    <>
      {isTransparent ? (
        <button
          disabled={disabled}
          onClick={onClick}
          type={type}
          className={`bg-transparent  border  border-green-600 hover:bg-green-600/20 py-1 px-2 text-center flex gap-1.5 items-center justify-center text-green-500 rounded-md hover:scale-102 shadow-md shadow-black/20 cursor-pointer transition-all duration-200 ${className} `}
        >
          {children}
        </button>
      ) : (
        <button
          disabled={disabled}
          onClick={onClick}
          type={type}
          className={`px-2 py-1 bg-green-800 text-white rounded-md flex gap-1.5 justify-center items-center hover:bg-green-700 hover:scale-102 transition-all duration-200 shadow-md shadow-black/20 cursor-pointer disabled:bg-green-600 disabled:cursor-not-allowed ${className}`}
        >
          {children}
        </button>
      )}
    </>
  );
}
