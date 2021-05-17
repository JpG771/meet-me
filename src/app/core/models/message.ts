export interface Message {
  id?: string;
  toUser: string;
  byUser: string;
  message: string;
  read: boolean;
}