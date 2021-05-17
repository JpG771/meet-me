import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  messages = new ReplaySubject<Message[]>();
}
