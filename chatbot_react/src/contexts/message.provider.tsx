import { useEffect, useState, type ReactNode } from "react";
import type { Message, MessageRequest } from "../types/message";
import { MessageContext } from "./message.context";
import { ChatService } from "../services/chat.service";
import type { Conversation } from "../types/conversation";
import { useNavigate } from "react-router-dom";

export function MessageProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [conversationSelected, setConversationSelected] = useState<
    string | null
  >(null);

  const loadConversations = async () => {
    const response = (await ChatService.getChat()) as Conversation[];

    setConversations([...response].reverse());
  };

  const newMessage = async (messageToSend: string) => {
    const message = messageToSend.trim();

    if (message === "") return;

    setMessages((previousMessages) => {
      return [
        ...previousMessages,
        { role: "user", message, createdAt: new Date() },
      ];
    });

    setIsTyping(true);

    const newMessage: MessageRequest = { message };

    if (conversationSelected) newMessage.conversationId = conversationSelected;

    const response = await ChatService.postMessage(newMessage);

    await loadConversations();

    setIsTyping(false);
    setMessages((previousMessages) => {
      return [...previousMessages, { ...response }];
    });

    navigate(`/${newMessage.conversationId}`);
  };

  const setConversation = (id: string | null) => {
    setConversationSelected(id);
    if (!id) setMessages([]);
    navigate(`/${id ? id : ""}`);
  };

  const removeConversation = async (id: string) => {
    await ChatService.deleteChat(id);

    await loadConversations();

    if (conversationSelected === id) {
      setConversationSelected(null);
    }
  };

  useEffect(() => {
    (async () => {
      await loadConversations();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (conversationSelected && conversationSelected !== "undefined") {
        setIsLoading(true);
        const response = await ChatService.getChatById(conversationSelected);

        setIsLoading(false);
        setMessages(response);
      }
    })();
  }, [conversationSelected]);

  return (
    <MessageContext.Provider
      value={{
        messages,
        isTyping,
        isLoading,
        conversationSelected,
        conversations,
        newMessage,
        setConversation,
        removeConversation,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}
