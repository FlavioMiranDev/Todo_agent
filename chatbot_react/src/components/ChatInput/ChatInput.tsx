import { useContext, useState } from "react";
import "./ChatInput.scss";
import { MessageContext } from "../../contexts/message.context";

export function ChatInput() {
  const { newMessage } = useContext(MessageContext);
  const [message, setMessage] = useState<string>("");

  const sendMessage = async () => {
    setMessage("");
    await newMessage(message);
    setMessage("");
  };

  return (
    <footer className="chat-input-container">
      <div className="input-wrapper">
        <textarea
          className="message-input"
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") await sendMessage();
          }}
        />
        <button
          className="send-button"
          onClick={async () => await sendMessage()}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </footer>
  );
}
