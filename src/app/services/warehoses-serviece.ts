import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { warehouses } from '../warehouses/warehouses.model';

@Injectable({
  providedIn: 'root',
})
export class WarehousesService {

  private apiUrl = 'http://161.97.128.217:8081/api/warehouses';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getWarehouses(): Observable<warehouses[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<warehouses[]>(this.apiUrl, { headers });
  }

  createWarehouse(warehouse: warehouses): Observable<warehouses> {
    const headers = this.getAuthHeaders();
    return this.http.post<warehouses>(this.apiUrl, warehouse, { headers });
  }

  updateWarehouse(warehouse: warehouses): Observable<warehouses> {
    const headers = this.getAuthHeaders();
    return this.http.put<warehouses>(`${this.apiUrl}/${warehouse.id}`, warehouse, { headers });
  }

  deleteWarehouse(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  getWarehoseById(id : string) : Observable<warehouses>
  {
    const headers = this.getAuthHeaders();
    return this.http.get<warehouses>(`${this.apiUrl}/${id}`, { headers });
  }
}
