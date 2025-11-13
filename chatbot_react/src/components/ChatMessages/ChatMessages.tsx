import { useContext, useEffect, useRef } from "react";
import "./ChatMessages.scss";
import { MessageCard } from "../Message/Message";
import { MessageContext } from "../../contexts/message.context";
import { NewChat } from "../NewChat/NewChat";

export function ChatMessages() {
  const { messages, isTyping, conversationSelected } =
    useContext(MessageContext);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <section className="chat-messages">
      {messages.length === 0 || !conversationSelected ? (
        <NewChat />
      ) : (
        messages.map((message, i) => (
          <MessageCard key={message.id || i} message={message} />
        ))
      )}
      {isTyping && (
        <MessageCard
          message={{
            message: "",
            role: "assistant",
            createdAt: new Date(),
          }}
          isTyping={true}
        />
      )}
      <div ref={messagesEndRef} />
    </section>
  );
}
