export interface Ticket {
  id: string;
  tenant_id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  created_at: string;
  updated_at: string;
  customer_id?: string;
  assigned_to?: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_type: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export interface TicketCreate {
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  customer_id?: string;
}

export interface TicketUpdate {
  title?: string;
  description?: string;
  status?: "open" | "in_progress" | "closed";
  priority?: "low" | "medium" | "high" | "urgent";
  assigned_to?: string;
}

export interface TicketMessageCreate {
  message: string;
}
