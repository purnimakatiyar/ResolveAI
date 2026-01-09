"use client";

import { useState, useEffect } from "react";
import { X, Send, Clock, User, Calendar } from "lucide-react";
import { Ticket, TicketMessage } from "@/types/ticket";
import { ticketService } from "@/services/ticketService";
import { PrimaryButton, SecondaryButton } from "@/components/Button";

interface TicketDetailModalProps {
  ticket: Ticket;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Ticket>) => Promise<void>;
}

const statusColors = {
  open: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  in_progress: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  closed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
};

const priorityColors = {
  low: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  medium: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
  high: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  urgent: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
};

export default function TicketDetailModal({ ticket, isOpen, onClose, onUpdate }: TicketDetailModalProps) {
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (ticket && isOpen) {
      loadMessages();
    }
  }, [ticket, isOpen]);

  const loadMessages = async () => {
    if (!ticket) return;
    setLoading(true);
    try {
      const data = await ticketService.getMessages(ticket.id);
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !newMessage.trim()) return;

    setSendingMessage(true);
    try {
      await ticketService.postMessage(ticket.id, { message: newMessage });
      setNewMessage("");
      await loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleStatusChange = async (status: "open" | "in_progress" | "closed") => {
    if (!ticket) return;
    try {
      await onUpdate(ticket.id, { status });
      if (status === "closed") {
        onClose();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 flex flex-col animate-in zoom-in-95 duration-200">

        <div className="flex items-start justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-500">
                #{ticket.id.slice(0, 8)}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {ticket.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                {ticket.status === "in_progress" ? "In Progress" : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {formatDate(ticket.created_at)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-500 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Customer:</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {ticket.customer_id ? ticket.customer_id.slice(0, 8) : "Unassigned"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Updated:</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {formatDate(ticket.updated_at)}
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-300">{ticket.description}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Messages</h3>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Send className="w-8 h-8 text-gray-400 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-xl bg-white dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {msg.sender_type}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {formatDate(msg.created_at)}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{msg.message}</p>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          {ticket.status !== "closed" && (
            <form onSubmit={handleSendMessage} className="flex gap-3 mb-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={sendingMessage}
                className="flex-1 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sendingMessage}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {sendingMessage ? "Sending..." : "Send"}
              </button>
            </form>
          )}

          <div className="flex gap-3">
            {ticket.status === "open" && (
              <SecondaryButton
                onClick={() => handleStatusChange("in_progress")}
                className="flex-1"
              >
                Start Progress
              </SecondaryButton>
            )}
            {ticket.status === "in_progress" && (
              <SecondaryButton
                onClick={() => handleStatusChange("open")}
                className="flex-1"
              >
                Reopen Ticket
              </SecondaryButton>
            )}
            {ticket.status !== "closed" && (
              <PrimaryButton
                onClick={() => handleStatusChange("closed")}
                className="flex-1"
              >
                Close Ticket
              </PrimaryButton>
            )}
            {ticket.status === "closed" && (
              <SecondaryButton
                onClick={() => handleStatusChange("open")}
                className="flex-1"
              >
                Reopen Ticket
              </SecondaryButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}