import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier, SupplierFormData } from '../suppliers-component/supplier.model';

@Injectable({
  providedIn: 'root',
})
export class SuppliersService {
  private apiUrl = 'http://161.97.128.217:8081/api/suppliers';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get all suppliers
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Get single supplier by ID
  getSupplierById(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Create new supplier
  createSupplier(supplierData: SupplierFormData): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplierData, { headers: this.getAuthHeaders() });
  }

  // Update supplier
  updateSupplier(id: string, supplierData: SupplierFormData): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, supplierData, {
      headers: this.getAuthHeaders()
    });
  }

  // Delete supplier
  deleteSupplier(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Toggle supplier active status
  toggleSupplierStatus(id: string, active: boolean): Observable<Supplier> {
    return this.http.patch<Supplier>(`${this.apiUrl}/${id}/status`,
      { active },
      { headers: this.getAuthHeaders() }
    );
  }
}
