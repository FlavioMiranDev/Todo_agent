import "./Message.scss";
import ReactMarkdown from "react-markdown";
import type { Message } from "../../types/message";

interface MessageProps {
  message: Message;
  isTyping?: boolean;
}

export function MessageCard({ message, isTyping = false }: MessageProps) {
  const date = new Date(message.createdAt);

  return (
    <article className={`message ${message.role}`}>
      <div className="message-avatar">
        {message.role === "assistant" ? "AI" : "U"}
      </div>
      <div className="message-content">
        {isTyping ? (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        ) : (
          <>
            {/* <div className="message-text">{message.message}</div> */}
            <div className="message-text">
              <ReactMarkdown>{message.message}</ReactMarkdown>
            </div>
            <div className="message-time">
              {date.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </>
        )}
      </div>
    </article>
  );
}
