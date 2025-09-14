import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ContractModel} from '../../core/models/contract.model';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class ContractService {
  private apiUrl = environment.apiUrl + '/contracts';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ContractModel[]> {
    return this.http.get<ContractModel[]>(this.apiUrl);
  }

  create(contract: ContractModel): Observable<ContractModel> {
    return this.http.post<ContractModel>(this.apiUrl, contract);
  }

  update(id: number, contract: ContractModel): Observable<ContractModel> {
    return this.http.put<ContractModel>(`${this.apiUrl}/${id}`, contract);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
