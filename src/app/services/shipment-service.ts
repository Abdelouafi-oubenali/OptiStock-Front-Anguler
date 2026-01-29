import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shipment } from '../shipments/store/shipments.state';

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {
  private apiUrl = 'http://161.97.128.217:8081/api/shipments';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get all shipments
  getShipments(): Observable<Shipment[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Shipment[]>(this.apiUrl, { headers });
  }

  // Get shipment by tracking number
  getShipment(trackingNumber: string): Observable<Shipment> {
    const headers = this.getAuthHeaders();
    return this.http.get<Shipment>(`${this.apiUrl}/${trackingNumber}`, { headers });
  }

  // Create new shipment
  createShipment(shipment: Omit<Shipment, 'trackingNumber'> | Shipment): Observable<Shipment> {
    const headers = this.getAuthHeaders();
    return this.http.post<Shipment>(this.apiUrl, shipment, { headers });
  }

  // Update shipment
  updateShipment(trackingNumber: string, shipment: Partial<Shipment>): Observable<Shipment> {
    const headers = this.getAuthHeaders();
    return this.http.put<Shipment>(`${this.apiUrl}/${trackingNumber}`, shipment, { headers });
  }

  // Delete shipment
  deleteShipment(trackingNumber: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${trackingNumber}`, { headers });
  }

  // Get shipments by status
  getShipmentsByStatus(status: string): Observable<Shipment[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Shipment[]>(`${this.apiUrl}/status/${status}`, { headers });
  }

  // Get shipments by sales order
  getShipmentsBySalesOrder(salesOrderId: string): Observable<Shipment[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Shipment[]>(`${this.apiUrl}/sales-order/${salesOrderId}`, { headers });
  }

  // Update shipment status
  updateShipmentStatus(trackingNumber: string, status: string): Observable<Shipment> {
    const headers = this.getAuthHeaders();
    return this.http.patch<Shipment>(
      `${this.apiUrl}/${trackingNumber}/status`,
      { status },
      { headers }
    );
  }
}
