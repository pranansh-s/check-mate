export interface Room {
  participants: string[];
  createdBy: string;
  chat: ChatMessage[];
}

export interface ChatMessage {
  content: string;
  senderId: string;
  timestamp: number;
}
