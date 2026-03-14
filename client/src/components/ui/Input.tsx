import type { JSX } from "react";

type InputProps = {
  id?: string;
  type?: string;
  className?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
};

export default function Input({
  type = "text",
  className = "",
  placeholder,
  name,
  id,
  value,
  onChange,
  required = false,
}: InputProps): JSX.Element {
  return (
    <input
      id={id}
      autoComplete="off"
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-3 py-1 rounded-md bg-gray-800 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all ${className}`}
      placeholder={placeholder}
    />
  );
}
