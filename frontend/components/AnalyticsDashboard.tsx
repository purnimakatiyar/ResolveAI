// ============================================
// FILE: components/AnalyticsDashboard.tsx
// ============================================
"use client";

import { useMemo } from "react";
import { Ticket } from "@/types/ticket";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
} from "lucide-react";

interface AnalyticsDashboardProps {
  tickets: Ticket[];
}

const COLORS = {
  low: "#3b82f6",
  medium: "#eab308",
  high: "#f97316",
  urgent: "#ef4444",
  open: "#3b82f6",
  in_progress: "#eab308",
  closed: "#22c55e",
};

export default function AnalyticsDashboard({ tickets }: AnalyticsDashboardProps) {
  const analytics = useMemo(() => {
    // Calculate metrics
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "open").length;
    const inProgress = tickets.filter((t) => t.status === "in_progress").length;
    const closed = tickets.filter((t) => t.status === "closed").length;
    const closedRate = total > 0 ? ((closed / total) * 100).toFixed(1) : "0";

    // Priority distribution
    const priorityData = [
      { name: "Low", value: tickets.filter((t) => t.priority === "low").length, color: COLORS.low },
      { name: "Medium", value: tickets.filter((t) => t.priority === "medium").length, color: COLORS.medium },
      { name: "High", value: tickets.filter((t) => t.priority === "high").length, color: COLORS.high },
      { name: "Urgent", value: tickets.filter((t) => t.priority === "urgent").length, color: COLORS.urgent },
    ];

    // Status distribution
    const statusData = [
      { name: "Open", value: open, color: COLORS.open },
      { name: "In Progress", value: inProgress, color: COLORS.in_progress },
      { name: "Closed", value: closed, color: COLORS.closed },
    ];

    // Tickets created over last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    const ticketTrends = last7Days.map((date) => {
      const dayTickets = tickets.filter((t) => t.created_at.startsWith(date));
      return {
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        created: dayTickets.length,
        closed: dayTickets.filter((t) => t.status === "closed").length,
      };
    });

    // Average resolution time (for closed tickets)
    const closedTickets = tickets.filter((t) => t.status === "closed");
    const avgResolutionHours = closedTickets.length > 0
      ? closedTickets.reduce((sum, t) => {
          const created = new Date(t.created_at).getTime();
          const updated = new Date(t.updated_at).getTime();
          return sum + (updated - created) / (1000 * 60 * 60);
        }, 0) / closedTickets.length
      : 0;

    // Response time by priority
    const responseTimeData = [
      {
        priority: "Low",
        avgHours: tickets
          .filter((t) => t.priority === "low" && t.status === "closed")
          .reduce((sum, t) => {
            const created = new Date(t.created_at).getTime();
            const updated = new Date(t.updated_at).getTime();
            return sum + (updated - created) / (1000 * 60 * 60);
          }, 0) / Math.max(tickets.filter((t) => t.priority === "low" && t.status === "closed").length, 1),
      },
      {
        priority: "Medium",
        avgHours: tickets
          .filter((t) => t.priority === "medium" && t.status === "closed")
          .reduce((sum, t) => {
            const created = new Date(t.created_at).getTime();
            const updated = new Date(t.updated_at).getTime();
            return sum + (updated - created) / (1000 * 60 * 60);
          }, 0) / Math.max(tickets.filter((t) => t.priority === "medium" && t.status === "closed").length, 1),
      },
      {
        priority: "High",
        avgHours: tickets
          .filter((t) => t.priority === "high" && t.status === "closed")
          .reduce((sum, t) => {
            const created = new Date(t.created_at).getTime();
            const updated = new Date(t.updated_at).getTime();
            return sum + (updated - created) / (1000 * 60 * 60);
          }, 0) / Math.max(tickets.filter((t) => t.priority === "high" && t.status === "closed").length, 1),
      },
      {
        priority: "Urgent",
        avgHours: tickets
          .filter((t) => t.priority === "urgent" && t.status === "closed")
          .reduce((sum, t) => {
            const created = new Date(t.created_at).getTime();
            const updated = new Date(t.updated_at).getTime();
            return sum + (updated - created) / (1000 * 60 * 60);
          }, 0) / Math.max(tickets.filter((t) => t.priority === "urgent" && t.status === "closed").length, 1),
      },
    ];

    // Assigned vs Unassigned tickets
    const assignedCount = tickets.filter((t) => t.assigned_to).length;
    const unassignedCount = tickets.filter((t) => !t.assigned_to).length;

    // Tickets with customers vs without
    const withCustomer = tickets.filter((t) => t.customer_id).length;
    const withoutCustomer = tickets.filter((t) => !t.customer_id).length;

    return {
      total,
      open,
      inProgress,
      closed,
      closedRate,
      priorityData,
      statusData,
      ticketTrends,
      avgResolutionHours,
      responseTimeData,
      assignedCount,
      unassignedCount,
      withCustomer,
      withoutCustomer,
    };
  }, [tickets]);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Tickets"
          value={analytics.total}
          icon={Activity}
          color="purple"
        />
        <MetricCard
          title="Resolution Rate"
          value={`${analytics.closedRate}%`}
          icon={CheckCircle}
          color="green"
          trend={Number(analytics.closedRate) > 50 ? "up" : "down"}
        />
        <MetricCard
          title="Avg Resolution Time"
          value={`${analytics.avgResolutionHours.toFixed(1)}h`}
          icon={Clock}
          color="blue"
        />
        <MetricCard
          title="Unassigned Tickets"
          value={analytics.unassignedCount}
          icon={AlertCircle}
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Trends */}
        <ChartCard title="Ticket Trends (Last 7 Days)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.ticketTrends}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis
                dataKey="date"
                className="text-xs"
                stroke="#9ca3af"
              />
              <YAxis className="text-xs" stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="created"
                stroke="#a855f7"
                strokeWidth={2}
                name="Created"
                dot={{ fill: "#a855f7", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="closed"
                stroke="#22c55e"
                strokeWidth={2}
                name="Closed"
                dot={{ fill: "#22c55e", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Priority Distribution */}
        <ChartCard title="Priority Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => 
                  percent !== undefined ? `${name}: ${(percent * 100).toFixed(0)}%` : name
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Status Distribution */}
        <ChartCard title="Status Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.statusData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="name" className="text-xs" stroke="#9ca3af" />
              <YAxis className="text-xs" stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {analytics.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Response Time by Priority */}
        <ChartCard title="Avg Resolution Time by Priority">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="priority" className="text-xs" stroke="#9ca3af" />
              <YAxis className="text-xs" stroke="#9ca3af" label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                }}
                formatter={(value: number | undefined) => value !== undefined ? `${value.toFixed(1)}h` : "N/A"}
              />
              <Bar dataKey="avgHours" fill="#a855f7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-xl bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">Assignment Status</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analytics.assignedCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Assigned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{analytics.unassignedCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Unassigned</div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">Customer Association</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analytics.withCustomer}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">With Customer</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{analytics.withoutCustomer}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Without Customer</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: "purple" | "green" | "blue" | "orange";
  trend?: "up" | "down";
}

function MetricCard({ title, value, icon: Icon, color, trend }: MetricCardProps) {
  const colorClasses = {
    purple: "from-purple-500 to-pink-500",
    green: "from-green-500 to-emerald-500",
    blue: "from-blue-500 to-cyan-500",
    orange: "from-orange-500 to-red-500",
  };

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 backdrop-blur-xl hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
        )}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</div>
      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
    </div>
  );
}

// Chart Card Component
interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
      {children}
    </div>
  );
}
