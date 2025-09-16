import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StockTransactionModel} from '../../core/models/stock-transaction.model';
import {ProductModel} from '../../core/models/Product.model';
import {StockHistoryModel} from '../../core/models/stock-history.model'

@Injectable({
  providedIn: 'root'
})
export class StockManagementService {
  private apiUrl = "/api";

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${this.apiUrl}/products`);
  }

  getConsumables(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/consumables`);
  }

  getTransactions(date?: Date): Observable<StockHistoryModel[]> {
    let params = new HttpParams();
    if (date) {
      // Format YYYY-MM-DD en utilisant la date locale
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // mois commence à 0
      const day = date.getDate().toString().padStart(2, '0');

      const formatted = `${year}-${month}-${day}`;
      params = params.set('date', formatted);
    }

    return this.http.get<StockHistoryModel[]>(`${this.apiUrl}/stocks`, { params });
  }

  updateStock(stockTransaction: StockTransactionModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/stocks`, stockTransaction);
  }
}
