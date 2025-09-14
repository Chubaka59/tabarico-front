import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RoleModel} from '../../core/models/role.model';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private apiUrl = environment.apiUrl + '/roles';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RoleModel[]> {
    return this.http.get<RoleModel[]>(this.apiUrl);
  }

  create(role: RoleModel): Observable<RoleModel> {
    return this.http.post<RoleModel>(this.apiUrl, role);
  }

  update(id: number, role: RoleModel): Observable<RoleModel> {
    return this.http.put<RoleModel>(`${this.apiUrl}/${id}`, role);
  }
}
