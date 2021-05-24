import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Message } from '../models/message';
import { UserDetail } from '../models/user-detail';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  messages = new ReplaySubject<Message[]>();
  userDetail = new ReplaySubject<UserDetail>();
}
