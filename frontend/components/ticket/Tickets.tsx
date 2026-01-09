"use client";

import { Ticket } from "@/types/ticket";
import { Clock, AlertCircle, CheckCircle2, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

const statusColors = {
  open: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  in_progress: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  closed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
};

const priorityColors = {
  low: "text-gray-600 dark:text-gray-400",
  medium: "text-blue-600 dark:text-blue-400",
  high: "text-orange-600 dark:text-orange-400",
  urgent: "text-red-600 dark:text-red-400",
};

const statusIcons = {
  open: AlertCircle,
  in_progress: Clock,
  closed: CheckCircle2,
};

export default function TicketCard({ ticket, onClick }: TicketCardProps) {
  const StatusIcon = statusIcons[ticket.status];

  return (
    <div
      onClick={() => onClick(ticket)}
      className="group relative p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.02]"
    >
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl bg-gradient-to-b from-purple-500 to-pink-500" />

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {ticket.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {ticket.description}
          </p>
        </div>

        <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status]} flex items-center gap-1.5 whitespace-nowrap`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {ticket.status.replace("_", " ")}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className={`font-medium ${priorityColors[ticket.priority]}`}>
            {ticket.priority.toUpperCase()}
          </span>
          <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
          </span>
        </div>

        <MessageSquare className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  );
}
