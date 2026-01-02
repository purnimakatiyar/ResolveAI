import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  icon?: LucideIcon;
}

export const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        disabled={loading || props.disabled}
        className={`group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 dark:hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {children}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-500 dark:to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";

export const SecondaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, icon: Icon, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={`w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 py-3.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm hover:shadow-md ${className}`}
      >
        {Icon && <Icon className="w-5 h-5" />}
        {children}
      </button>
    );
  }
);

SecondaryButton.displayName = "SecondaryButton";
