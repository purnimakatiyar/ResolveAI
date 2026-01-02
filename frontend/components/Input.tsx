import { InputHTMLAttributes, forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'icon'> {
  icon?: LucideIcon;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon: Icon, className = "", ...props }, ref) => {
    return (
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors duration-300" />
        )}
        <input
          ref={ref}
          {...props}
          className={`w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 ${
            Icon ? "pl-12" : "pl-4"
          } pr-4 py-3.5 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:focus:ring-purple-400/20 transition-all duration-300 ${className}`}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
