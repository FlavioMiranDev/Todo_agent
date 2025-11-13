import type { Conversation } from "./conversation";

export interface Message {
  id?: string;
  conversationId?: string;
  role: "user" | "assistant" | "system";
  message: string;
  createdAt: Date;
}

export interface MessageRequest {
  conversationId?: string;
  message: string;
}

export interface MessageContextProps {
  messages: Message[];
  conversations: Conversation[];
  isTyping: boolean;
  isLoading: boolean;
  conversationSelected: string | null;
  newMessage: (messageToSend: string) => void;
  setConversation: (id: string | null) => void;
  removeConversation: (id: string) => void;
}
