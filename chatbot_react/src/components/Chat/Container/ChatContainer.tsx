import { useState, useRef, useEffect } from "react";
import { useChatContext } from "../../../contexts/ChatContext";
import ReactMarkdown from "react-markdown";
import "./ChatContainer.scss";

interface ChatContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatContainer({ isOpen, onClose }: ChatContainerProps) {
  const {
    messages,
    conversations,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
    deleteConversation,
  } = useChatContext();

  const [newMessage, setNewMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setNewMessage("");

    await sendMessage(newMessage);
  };

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSendMessage();
    }
  };

  const handleNewConversation = () => {
    setSelectedConversation(null);
    setNewMessage("");
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  const handleDeleteConversation = async () => {
    if (!selectedConversation) return;

    if (
      window.confirm(
        "Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita."
      )
    ) {
      await deleteConversation();
    }
  };

  const getConversationName = () => {
    if (!selectedConversation) return "Nova Conversa";
    const conversation = conversations.find(
      (c) => c.id === selectedConversation
    );
    return conversation?.name || "Conversa";
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div className={`chat-container ${isVisible ? "open" : ""}`}>
      <div className="chat-sidebar">
        <div className="conversations-header">
          <h3>Conversas</h3>
        </div>
        <div className="conversations-list">
          {conversations.length === 0 ? (
            <div className="empty-conversations">Nenhuma conversa</div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`conversation-item ${
                  selectedConversation === conversation.id ? "active" : ""
                }`}
                onClick={() => handleConversationSelect(conversation.id)}
              >
                <div className="conversation-name">{conversation.name}</div>
                <div className="conversation-date">
                  {new Date(conversation.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
            ))
          )}
        </div>
        <button className="new-chat-btn" onClick={handleNewConversation}>
          Nova Conversa
        </button>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <h3>{getConversationName()}</h3>
          <div className="chat-actions">
            {selectedConversation && (
              <button
                className="chat-btn chat-btn--danger"
                onClick={() => {
                  handleDeleteConversation();
                }}
                title="Excluir Conversa"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-trash3-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                </svg>
              </button>
            )}
            <button className="chat-btn" onClick={onClose} title="Fechar Chat">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-x-lg"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 && !selectedConversation ? (
            <div className="message assistant">
              <ReactMarkdown>
                Olá! Sou seu assistente de tarefas. Como posso ajudar?
              </ReactMarkdown>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.role === "user" ? "user" : "assistant"
                }`}
              >
                {message.role === "assistant" ? (
                  <ReactMarkdown>{message.response}</ReactMarkdown>
                ) : (
                  message.response
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              className="chat-input"
              placeholder="Digite sua mensagem..."
              rows={1}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
