import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DashboardModel} from '../../core/models/dashboard.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserAccounting(): Observable<DashboardModel[]> {
    return this.http.get<DashboardModel[]>(`${this.apiUrl}/dashboard`);
  }

  updateUserAccounting(user: DashboardModel): Observable<DashboardModel> {
    return this.http.put<DashboardModel>(`${this.apiUrl}/dashboard/${user.username}`, user);
  }

  resetAccounting() {
    return this.http.get<void>(`${this.apiUrl}/users/reset-accounting`);
  }

  setSalesBlocked(blocked: boolean): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/dashboard/sales-block?blocked=${blocked}`, {});
  }

  getSalesBlocked(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/dashboard/sales-block`);
  }
}
