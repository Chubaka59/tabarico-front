import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {UserModel} from '../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ExporterSaleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addExporterSale(sale: { userId: number ,quantity: number; level: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/exportersales`, sale);
  }
}
