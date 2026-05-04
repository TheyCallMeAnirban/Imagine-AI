export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  type: MessageType;
  content: string;
  timestamp: string;
  metadata?: {
    filename?: string;
    alt?: string;
  };
}
