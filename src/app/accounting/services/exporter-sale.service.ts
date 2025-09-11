import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExporterSaleService {
  private apiUrl = 'http://localhost:8080/exportersales';

  constructor(private http: HttpClient) {}

  addExporterSale(sale: { quantity: number; level: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, sale);
  }
}
