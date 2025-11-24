export interface Conversation {
  id: string;
  name: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  response: string;
  role: string;
}
