export interface Room {
  participants: string[];
  createdBy: string;
  chat: string[];
}

export interface ChatMessage {
  content: string;
  senderId: string;
  timestamp: number;
}
