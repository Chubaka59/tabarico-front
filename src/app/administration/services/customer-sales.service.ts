import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomerSale} from '../../core/models/customer-sales.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerSalesService {
  private apiUrl = "/api/customersales";

  constructor(private http: HttpClient) {}

  getSales(date?: Date): Observable<CustomerSale[]> {
    let params = new HttpParams();
    if (date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const formatted = `${year}-${month}-${day}`;
      params = params.set('date', formatted);
    }
    return this.http.get<CustomerSale[]>(`${this.apiUrl}`, { params });
  }

  deleteSale(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
