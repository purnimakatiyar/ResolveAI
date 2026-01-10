// ============================================
// FILE: app/dashboard/page.tsx
// ============================================
"use client";

import { useState, useEffect } from "react";
import { Plus, Search, TicketIcon, BarChart3, List } from "lucide-react";
import { Ticket } from "@/types/ticket";
import { ticketService } from "@/services/ticketService";
import TicketCard from "@/components/ticket/TicketCard";
import CreateTicketModal from "@/components/ticket/CreateTicketModal";
import TicketDetailModal from "@/components/ticket/TicketDetailModal";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import Input from "@/components/Input";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

type ViewMode = "tickets" | "analytics";

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("tickets");

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, statusFilter, searchQuery]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await ticketService.getTickets();
      setTickets(data);
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
  };

  const handleCreateTicket = async (data: any) => {
    await ticketService.createTicket(data);
    await loadTickets();
  };

  const handleUpdateTicket = async (id: string, updates: Partial<Ticket>) => {
    await ticketService.updateTicket(id, updates);
    await loadTickets();
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
            Support Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all your support tickets
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setViewMode("tickets")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              viewMode === "tickets"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                : "bg-white dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
            }`}
          >
            <List className="w-5 h-5" />
            Tickets
          </button>
          <button
            onClick={() => setViewMode("analytics")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              viewMode === "analytics"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                : "bg-white dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-6 rounded-xl bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 backdrop-blur-xl">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Tickets</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
          </div>
          <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
            <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Open</div>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">{stats.open}</div>
          </div>
          <div className="p-6 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800">
            <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">In Progress</div>
            <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">{stats.in_progress}</div>
          </div>
          <div className="p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
            <div className="text-sm text-green-600 dark:text-green-400 mb-1">Closed</div>
            <div className="text-3xl font-bold text-green-700 dark:text-green-400">{stats.closed}</div>
          </div>
        </div>

        {/* Conditional Content Based on View Mode */}
        {viewMode === "analytics" ? (
          // Analytics View
          <AnalyticsDashboard tickets={tickets} />
        ) : (
          // Tickets View
          <>
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  icon={Search}
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>

              <PrimaryButton onClick={() => setIsCreateModalOpen(true)} className="sm:w-auto">
                <Plus className="w-5 h-5 mr-2" />
                New Ticket
              </PrimaryButton>
            </div>

            {/* Tickets Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-20">
                <TicketIcon className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No tickets found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first ticket to get started"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <PrimaryButton onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Ticket
                  </PrimaryButton>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onClick={() => setSelectedTicket(ticket)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTicket}
      />

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={handleUpdateTicket}
        />
      )}
    </div>
  );
}
