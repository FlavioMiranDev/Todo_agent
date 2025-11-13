import { apiClient } from "../api/httpClient";
import type { Message, MessageRequest } from "../types/message";

async function postMessage(message: MessageRequest) {
  const response = await apiClient.post("chat", message);
  const data = response.data;
  const m: Message = {
    message: data.response,
    conversationId: data.conversationId,
    createdAt: new Date(),
    role: "assistant",
  };

  return m;
}

async function getChatById(id: string) {
  const response = await apiClient.get(`chat/${id}`);

  return response.data;
}

async function getChat() {
  const response = await apiClient.get("chat");

  return response.data;
}

async function deleteChat(id: string) {
  await apiClient.delete(`chat/${id}`);
}

export const ChatService = {
  getChatById,
  getChat,
  postMessage,
  deleteChat,
};
