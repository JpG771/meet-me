import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  get userName() {
    return this.currentUser && this.currentUser.user_metadata ? this.currentUser.user_metadata.full_name : undefined;
  }

  constructor() { }

  currentUser: any;
}
