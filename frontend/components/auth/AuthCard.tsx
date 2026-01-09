import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 animate-pulse" />
      
      <div className="relative rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl shadow-2xl p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            {subtitle}
          </p>
        )}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}