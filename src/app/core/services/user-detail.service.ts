import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDetail } from '../models/user-detail';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {

  constructor(private http: HttpClient) { }
  
  read(id: string) {
    return this.http.post<UserDetail>('/.netlify/functions/user-read', id);
  }
  
  getForUser(user: string) {
    return this.http.post<UserDetail>('/.netlify/functions/user-get-for-user', user);
  }

  create(data: UserDetail) {
    return this.http.post<UserDetail>('/.netlify/functions/user-create', { ...data });
  }

  update(data: UserDetail) {
    return this.http.post<UserDetail>('/.netlify/functions/user-update', { ...data });
  }

  delete(id: string) {
    return this.http.post('/.netlify/functions/user-delete', id);
  }
}
