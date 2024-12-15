import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:5000/employee';

  constructor() {}

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  postData(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  deleteData(id: Number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
  
  updateData(id: Number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, data);
 }

}
