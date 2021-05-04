import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meet } from '../models/meet';

@Injectable({
  providedIn: 'root'
})
export class MeetService {

  constructor(private http: HttpClient) { }

  readAll() {
    return this.http.get<Meet[]>('/.netlify/functions/meet-read-all');
  }

  create(data: Meet) {
    return this.http.post('/.netlify/functions/meet-create', { ...data });
  }

  update(data: Meet) {
    return this.http.post('/.netlify/functions/meet-create', { ...data });
  }

  delete(id: string) {
    return this.http.post('/.netlify/functions/meet-delete', id);
  }

  findByDateRange(startDate: string, endDate: string) {
    return this.http.post('/.netlify/functions/meet-find', { startDate, endDate });
  }
}
