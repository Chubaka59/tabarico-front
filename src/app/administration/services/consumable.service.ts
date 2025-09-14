import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ConsumableModel} from '../../core/models/consumable.model';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConsumableService {
  private apiUrl = environment.apiUrl + '/consumables';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ConsumableModel[]> {
    return this.http.get<ConsumableModel[]>(this.apiUrl);
  }

  create(consumable: ConsumableModel): Observable<ConsumableModel> {
    return this.http.post<ConsumableModel>(this.apiUrl, consumable);
  }

  update(id: number, consumable: ConsumableModel): Observable<ConsumableModel> {
    return this.http.put<ConsumableModel>(`${this.apiUrl}/${id}`, consumable);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
