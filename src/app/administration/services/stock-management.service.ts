import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {StockTransactionModel} from '../../core/models/stock-transaction.model';
import {ProductModel} from '../../core/models/Product.model';
import {StockHistoryModel} from '../../core/models/stock-history.model'
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockManagementService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${this.apiUrl}/products`);
  }

  getTransactions(date?: Date): Observable<StockHistoryModel[]> {
    let params = new HttpParams();
    if (date) {
      // format en yyyy-MM-dd (classique pour Spring Boot)
      const formatted = date.toISOString().split('T')[0];
      params = params.set('date', formatted);
    }

    return this.http.get<StockHistoryModel[]>(`${this.apiUrl}/stocks`, { params });
  }

  updateStock(stockTransaction: StockTransactionModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/stocks`, stockTransaction);
  }
}
