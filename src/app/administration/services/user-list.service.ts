import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserModel} from '../../core/models/user.model';
import {RoleModel} from '../../core/models/role.model';

@Injectable({
  providedIn: 'root'
})
export class UserListService {
  private apiUrl = "/api";

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.apiUrl}/users`);
  }

  updateUser(id: number, formData: FormData): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.apiUrl}/users/${id}`, formData);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  getRoles(): Observable<RoleModel[]> {
    return this.http.get<RoleModel[]>(`${this.apiUrl}/roles`);
  }

  createUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, formData);
  }

  changePassword(newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/change-password`, { newPassword });
  }
}
