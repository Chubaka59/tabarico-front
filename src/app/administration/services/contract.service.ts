import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ContractModel} from '../../core/models/contract.model';
import {Observable} from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ContractService {
  private apiUrl = 'http://localhost:8080/contracts';

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
