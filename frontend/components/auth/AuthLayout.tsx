import { ReactNode } from "react";
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden
                    bg-white dark:bg-neutral-950 transition-colors duration-300">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br
                      from-purple-500/20 via-pink-400/10 to-transparent
                      dark:from-purple-600/20 dark:via-pink-500/10" />

      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
