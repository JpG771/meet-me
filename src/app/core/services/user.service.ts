import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  get userName() {
    return this.currentUser && this.currentUser.user_metadata ? this.currentUser.user_metadata.full_name : undefined;
  }

  constructor() { }

  currentUser?: User;
}
