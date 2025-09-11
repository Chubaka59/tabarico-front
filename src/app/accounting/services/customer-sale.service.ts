import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProductModel} from '../../core/models/Product.model';
import {ContractModel} from '../../core/models/contract.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerSaleService {
  private apiUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${this.apiUrl}products`);
  }

  getSaleTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}customersales/saletypes`);
  }

  getContracts(): Observable<ContractModel[]> {
    return this.http.get<ContractModel[]>(`${this.apiUrl}contracts`);
  }

  createClientSale(saleData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}customersales`, saleData);
  }
}
