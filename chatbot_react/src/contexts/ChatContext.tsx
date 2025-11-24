/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Conversation, Message } from "../types/chat";
import { apiClient } from "../api/httpClient";

interface ChatContextType {
  messages: Message[];
  conversations: Conversation[];
  selectedConversation: string | null;
  setSelectedConversation: (state: string | null) => void;
  sendMessage: (message: string) => void;
  deleteConversation: () => void;
}

interface ChatProviderProps {
  children: ReactNode;
}

const initialState: ChatContextType = {
  messages: [],
  conversations: [],
  selectedConversation: null,
  setSelectedConversation: (state: string | null) => {},
  sendMessage: (message: string) => {},
  deleteConversation: () => {},
};

const ChatContext = createContext<ChatContextType>(initialState);

export function ChatProvider({ children }: ChatProviderProps) {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [conversations, setConversation] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const updateChat = async () => {
    if (selectedConversation) {
      const response = await apiClient.get<Message[]>(
        `chat/${selectedConversation}`
      );
      const data = response.data;

      setMessages(data);
      return;
    }
    setMessages([]);
  };

  const updateConversation = async () => {
    const response = await apiClient.get<Conversation[]>("chat");
    const data = response.data;

    setConversation(data.reverse());
  };

  const sendMessage = async (message: string) => {
    const body = { message, conversation_id: selectedConversation };

    const m = await apiClient.post<Message>("chat", body);

    setSelectedConversation(m.data.conversation_id);

    await updateChat();
    await updateConversation();
  };

  const deleteConversation = async () => {
    await apiClient.delete(`chat/${selectedConversation}`);
    setSelectedConversation(null);

    updateChat();
    updateConversation();
  };

  useEffect(() => {
    (async () => {
      await updateConversation();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await updateChat();
    })();
  }, [selectedConversation]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        conversations,
        selectedConversation,
        setSelectedConversation,
        sendMessage,
        deleteConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => {
  const context = useContext(ChatContext);

  return context;
};
