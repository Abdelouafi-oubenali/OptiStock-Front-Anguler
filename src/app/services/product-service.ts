import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../product/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private apiUrl = 'http://161.97.128.217:8081/api/products';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getProducts(): Observable<Product[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Product[]>(this.apiUrl, { headers });
  }

  createProduct(product: Product): Observable<Product> {
    const headers = this.getAuthHeaders();
    return this.http.post<Product>(this.apiUrl, product, { headers });
  }
  updateProduct(product: Product): Observable<Product> {
    const headers = this.getAuthHeaders();
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product, { headers });
  }

  deleteProduct(productId: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${productId}`, { headers });
  }

  getProductById(productId: string) : Observable<Product>
  {
    const headers = this.getAuthHeaders();
    return this.http.get<Product>(`${this.apiUrl}/${productId}`, { headers });
  }
}
