/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext } from "react";
import type { MessageContextProps } from "../types/message";

const initialState: MessageContextProps = {
  messages: [],
  conversations: [],
  isTyping: false,
  isLoading: true,
  conversationSelected: null,
  newMessage: (messageToSend: string) => {},
  setConversation: (id: string | null) => {},
  removeConversation: (id: string) => {},
};

export const MessageContext = createContext<MessageContextProps>(initialState);

export function useMessageContext() {
  const ctx = useContext(MessageContext);

  return ctx;
}
