import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  read(toUser: string) {
    return this.http.post<Message[]>('/.netlify/functions/message-read', toUser);
  }

  create(data: Message) {
    return this.http.post<Message>('/.netlify/functions/message-create', { ...data });
  }

  update(data: Message) {
    return this.http.post<Message>('/.netlify/functions/message-update', { ...data });
  }

  delete(id: string) {
    return this.http.post('/.netlify/functions/message-delete', id);
  }
}
