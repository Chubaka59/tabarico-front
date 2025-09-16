import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProductModel} from '../../core/models/Product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = "/api/products";

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(this.apiUrl);
  }

  create(product: ProductModel): Observable<ProductModel> {
    return this.http.post<ProductModel>(this.apiUrl, product);
  }

  update(id: number, produit: ProductModel): Observable<ProductModel> {
    return this.http.put<ProductModel>(`${this.apiUrl}/${id}`, produit);
  }
}
