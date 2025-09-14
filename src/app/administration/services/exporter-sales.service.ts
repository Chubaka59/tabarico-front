import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ExporterSale} from '../../core/models/exporter-sales.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExporterSalesService {
  private apiUrl = environment.apiUrl + '/exportersales';

  constructor(private http: HttpClient) {}

  getSales(date?: Date): Observable<ExporterSale[]> {
    let params = new HttpParams();
    if (date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const formatted = `${year}-${month}-${day}`;
      params = params.set('date', formatted);
    }
    return this.http.get<ExporterSale[]>(`${this.apiUrl}`, { params });
  }

  deleteSale(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
