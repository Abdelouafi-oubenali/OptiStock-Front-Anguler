import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {InventoryDataLoding} from '../inventory-component/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {

  private apiUrl = 'http://161.97.128.217:8081/api/inventories';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getInventories(): Observable<InventoryDataLoding[]> {
    return this.http.get<InventoryDataLoding[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }


}
