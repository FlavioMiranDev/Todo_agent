/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "../api/httpClient";

export const todoApi = {
  getAll: () => apiClient.get("/todos"),
  create: (data: any) => apiClient.post("/todos", data),
  update: (id: string, data: any) => apiClient.put(`/todos/${id}`, data),
  delete: (id: string) => apiClient.delete(`/todos/${id}`),
};

// Chat endpoints
export const chatApi = {
  sendMessage: (data: { message: string; conversation_id?: string }) =>
    apiClient.post("/chat", data),
  getConversations: () => apiClient.get("/conversations"),
  createConversation: (data: any) => apiClient.post("/conversations", data),
};

// PDF endpoints
// export const pdfApi = {
//   getAll: () => apiClient.get("/pdfs"),
//   upload: (formData: FormData) => apiClient.post("/pdfs/upload", formData),
//   delete: (id: string) => apiClient.delete(`/pdfs/${id}`),
// };
