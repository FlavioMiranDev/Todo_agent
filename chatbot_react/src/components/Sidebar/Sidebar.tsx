import { useContext, useEffect } from "react";
import "./Sidebar.scss";
import { useParams } from "react-router-dom";
import { MessageContext } from "../../contexts/message.context";

export function Sidebar() {
  const { id } = useParams<{ id: string }>();
  const {
    conversationSelected,
    setConversation,
    conversations,
    removeConversation,
  } = useContext(MessageContext);

  // useEffect(() => {
  //   setConversation(id || null);
  // }, [id]);

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">AI</div>
        <span className="logo-text">ChatBot</span>
      </div>

      <button className="new-chat-btn" onClick={() => setConversation(null)}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>Novo Chat</span>
      </button>

      <nav className="chat-history">
        {conversations.map((conversation) => (
          <div
            key={conversation.convesationId}
            className={`history-item ${
              conversationSelected === conversation.convesationId
                ? "active"
                : ""
            }`}
            onClick={() => setConversation(conversation.convesationId)}
          >
            <div className="history-text">
              {conversation.title.slice(0, 20)}...
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  removeConversation(conversation.convesationId);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="var(--danger-color)"
                  className="bi bi-trash3"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </nav>

      <div className="user-section">
        <div className="user-info">
          <div className="user-avatar">U</div>
          <div className="user-name">Usuário</div>
        </div>
      </div>
    </aside>
  );
}
