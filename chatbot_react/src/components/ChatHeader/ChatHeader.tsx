import React from 'react';
import './ChatHeader.scss';

export const ChatHeader: React.FC = () => {
  return (
    <header className="chat-header">
      <h1 className="chat-title">Conversa Atual</h1>
    </header>
  );
};