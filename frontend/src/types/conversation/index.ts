export interface IMessage {
  id: number;
  text?: string;
  attachment?: string;
  timestamp: string;
  is_read?: boolean;
  sender?: number;
}

export interface IConversation {
  id: number;
  user_from?: number;
  user_to?: number;
  hall?: number;
  messages: IMessage[];
}
