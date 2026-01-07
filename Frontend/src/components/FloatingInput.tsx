import { AlertCircle } from "lucide-react";

interface FloatingInputProps {
  label?: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  helperText?: string;
}

export default function FloatingInput({
  label,
  value,
  onChange,
  type = "text",
  icon,
  disabled,
  readOnly,
  error,
  helperText,
}: FloatingInputProps) {
  return (
    <div className="w-full">
      <div
        className={`relative rounded-xl border transition
        ${error ? "border-red-500" : "border-gray-300"}
        ${disabled || readOnly ? "bg-gray-100" : "bg-white"}
        focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-500`}
      >
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}

        <input
          type={type}
          value={value}
          readOnly={readOnly}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder=" "
          className={`peer w-full bg-transparent px-4 py-3 text-sm outline-none rounded-xl
            ${icon ? "pl-11" : ""}
            ${disabled || readOnly ? "cursor-not-allowed text-gray-600" : ""}
          `}
        />

        {/* Floating Label */}
        <label
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm
          transition-all pointer-events-none
          peer-placeholder-shown:top-1/2
          peer-placeholder-shown:text-sm
          peer-focus:top-2
          peer-focus:text-xs
          peer-focus:text-green-600
          ${icon ? "left-11" : ""}
          ${value && "top-2 text-xs text-gray-600"}
        `}
        >
          {label}
        </label>
      </div>

      {/* Helper / Error */}
      {error ? (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={14} /> {error}
        </p>
      ) : (
        helperText && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )
      )}
    </div>
  );
}
