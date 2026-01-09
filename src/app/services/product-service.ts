import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Product } from '../product/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ProductService {

  constructor(private http: HttpClient) {}
    private apiUrl = 'http://161.97.128.217:8080/api/products';

     getProducts(): Observable<Product[]> {
      const token = localStorage.getItem('token') || '';
        console.log('Using token:', token);
       const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });

    return this.http.get<Product[]>(this.apiUrl, { headers });  }
  
}
 