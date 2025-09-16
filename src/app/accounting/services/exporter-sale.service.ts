import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExporterSaleService {
  private apiUrl = "/api";

  constructor(private http: HttpClient) {}

  addExporterSale(sale: { userId: number ,quantity: number; level: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/exportersales`, sale);
  }
}
