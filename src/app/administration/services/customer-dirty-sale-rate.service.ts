import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomerDirtySaleRateModel} from '../../core/models/customer-dirty-sale-rate.model';

@Injectable({ providedIn: 'root' })
export class CustomerDirtySaleRateService {
  private apiUrl = 'http://localhost:8080/customerDirtySaleRates';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CustomerDirtySaleRateModel[]> {
    return this.http.get<CustomerDirtySaleRateModel[]>(this.apiUrl);
  }

  update(id: number, customerDirtySaleRateModel: CustomerDirtySaleRateModel): Observable<CustomerDirtySaleRateModel> {
    return this.http.put<CustomerDirtySaleRateModel>(`${this.apiUrl}/${id}`, customerDirtySaleRateModel);
  }

  create(customerDirtySaleRate: CustomerDirtySaleRateModel): Observable<CustomerDirtySaleRateModel> {
    return this.http.post<CustomerDirtySaleRateModel>(this.apiUrl, customerDirtySaleRate);
  }
}
