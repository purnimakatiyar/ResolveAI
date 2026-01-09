import {
  Ticket,
  TicketCreate,
  TicketUpdate,
  TicketMessage,
  TicketMessageCreate,
} from "@/types/ticket";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await (await import("@/lib/supabaseClient")).supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${session.access_token}`,
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "An error occurred" }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  return response.json();
}

export const ticketService = {

  async createTicket(data: TicketCreate): Promise<Ticket> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/tickets/`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse<Ticket>(response);
  },


  async getTickets(status?: string): Promise<Ticket[]> {
    const headers = await getAuthHeaders();
    const url = new URL(`${API_BASE_URL}/api/tickets/`);
    if (status) {
      url.searchParams.append("status", status);
    }
    const response = await fetch(url.toString(), { headers });
    return handleResponse<Ticket[]>(response);
  },

  async getTicket(ticketId: string): Promise<Ticket> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}`, {
      headers,
    });
    return handleResponse<Ticket>(response);
  },

  async updateTicket(ticketId: string, data: TicketUpdate): Promise<{ status: string }> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse<{ status: string }>(response);
  },

  async closeTicket(ticketId: string): Promise<{ status: string }> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/close`, {
      method: "POST",
      headers,
    });
    return handleResponse<{ status: string }>(response);
  },


  async getMessages(ticketId: string): Promise<TicketMessage[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/messages`, {
      headers,
    });
    return handleResponse<TicketMessage[]>(response);
  },

  async postMessage(ticketId: string, data: TicketMessageCreate): Promise<TicketMessage> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse<TicketMessage>(response);
  },
};
