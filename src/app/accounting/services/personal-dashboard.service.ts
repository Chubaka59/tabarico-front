import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {PersonalDashboardModel} from '../models/personal-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class PersonalDashboardService {
  private apiUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

  getPersonalDashboardData(): Observable<PersonalDashboardModel> {
    return this.http.get<PersonalDashboardModel>(`${this.apiUrl}personalDashboard`);
  }
}
