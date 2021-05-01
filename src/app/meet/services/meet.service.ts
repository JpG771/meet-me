import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meet } from '../models/meet';

@Injectable({
  providedIn: 'root'
})
export class MeetService {

  constructor(private http: HttpClient) { }

  create(data: Meet) {
    return this.http.post('/.netlify/functions/meet-create', data);
  }

  readAll() {
    return this.http.get('/.netlify/functions/meet-read-all');
  }

  update(data: Meet) {
    return this.http.post('/.netlify/functions/meet-create', data);
  }

  delete(id: string) {
    return this.http.post('/.netlify/functions/meet-delete', id);
  }

  findByDateRange(startDate: string, endDate: string) {
    return this.http.post('/.netlify/functions/meet-find', { startDate, endDate });
  }
}
