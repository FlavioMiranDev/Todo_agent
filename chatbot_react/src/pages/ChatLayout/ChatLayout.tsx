import React from 'react';
import './ChatLayout.scss';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { ChatHeader } from '../../components/ChatHeader/ChatHeader';
import { ChatMessages } from '../../components/ChatMessages/ChatMessages';
import { ChatInput } from '../../components/ChatInput/ChatInput';
import { ChatFooter } from '../../components/ChatFooter/ChatFooter';

export const ChatLayout: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="chat-main">
        <ChatHeader />
        <ChatMessages />
        <ChatInput />
        <ChatFooter />
      </main>
    </div>
  );
};