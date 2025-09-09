import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { DashboardModel } from '../../core/models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

  getUserAccounting(): Observable<DashboardModel[]> {
    return this.http.get<DashboardModel[]>(`${this.apiUrl}dashboard`);
  }

  updateUserAccounting(user: DashboardModel): Observable<DashboardModel> {
    return this.http.put<DashboardModel>(`${this.apiUrl}dashboard/${user.username}`, user);
  }
}
