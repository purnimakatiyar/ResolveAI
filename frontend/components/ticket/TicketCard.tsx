"use client";

import { Ticket } from "@/types/ticket";
import { Clock, User, AlertCircle, CheckCircle, Loader } from "lucide-react";

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

const priorityConfig = {
  low: {
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    label: "Low",
  },
  medium: {
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800",
    label: "Medium",
  },
  high: {
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
    label: "High",
  },
  urgent: {
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    label: "Urgent",
  },
};

const statusConfig = {
  open: {
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    icon: AlertCircle,
    label: "Open",
  },
  in_progress: {
    color: "text-yellow-700 dark:text-yellow-400",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    icon: Loader,
    label: "In Progress",
  },
  closed: {
    color: "text-green-700 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-900/30",
    icon: CheckCircle,
    label: "Closed",
  },
};

export default function TicketCard({ ticket, onClick }: TicketCardProps) {
  const priority = priorityConfig[ticket.priority];
  const status = statusConfig[ticket.status];
  const StatusIcon = status.icon;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer p-6 rounded-xl bg-white dark:bg-gray-900/50 border-2 ${priority.border} hover:shadow-xl hover:scale-[1.02] transition-all duration-300 backdrop-blur-xl`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {ticket.title}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-500">
            #{ticket.id.slice(0, 8)}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {ticket.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">

        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}
        >
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </span>

        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.color}`}
        >
          {priority.label}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1">
          <User className="w-3.5 h-3.5" />
          <span>{ticket.customer_id ? `Customer ${ticket.customer_id.slice(0, 8)}` : "Unassigned"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(ticket.created_at)}</span>
        </div>
      </div>
    </div>
  );
}
