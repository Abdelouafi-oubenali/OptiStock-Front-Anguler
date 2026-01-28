import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import {
  PurchaseOrder,
  PurchaseOrderUpdate,
  PurchaseOrderFilter,
  PurchaseOrderStatus
} from './purchase-order.model';
import { PurchaseOrderCreate } from './models/purchase-order-create.model';
import { OrderLine } from './models/order-line.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  private apiUrl = 'http://161.97.128.217:8081/api/purchase-orders';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }


  getPurchaseOrders(filter?: PurchaseOrderFilter): Observable<PurchaseOrder[]> {
  let params = new HttpParams();

  if (filter) {
    if (filter.status) params = params.set('status', filter.status);
    if (filter.supplierId) params = params.set('supplierId', filter.supplierId);
    if (filter.startDate) params = params.set('startDate', filter.startDate.toISOString());
    if (filter.endDate) params = params.set('endDate', filter.endDate.toISOString());
    if (filter.reference) params = params.set('reference', filter.reference);
  }

  return this.http.get<PurchaseOrder[]>(this.apiUrl, {
    params,
    headers: this.getAuthHeaders()
  }).pipe(
    tap(data => {
      console.log('DATA FROM BACKEND:', data);
    })
  );
}


  getPurchaseOrderById(id: string): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  createPurchaseOrder(order: PurchaseOrderCreate): Observable<PurchaseOrder> {
    console.log('API Request payload:', JSON.stringify(order, null, 2));
    return this.http.post<PurchaseOrder>(
      this.apiUrl,
      order,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        console.log('API Response:', response);
      }),
      catchError(error => {
        console.error('API Error details:', error);
        if (error.error) {
          console.error('Error response body:', error.error);
        }
        throw error;
      })
    );
  }

  updatePurchaseOrder(id: string, updates: PurchaseOrderUpdate): Observable<PurchaseOrder> {
    return this.http.put<PurchaseOrder>(
      `${this.apiUrl}/${id}`,
      updates,
      { headers: this.getAuthHeaders() }
    );
  }

  deletePurchaseOrder(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }


  updateStatus(id: string, status: PurchaseOrderStatus): Observable<PurchaseOrder> {
    return this.http.patch<PurchaseOrder>(
      `${this.apiUrl}/${id}/status`,
      { status },
      { headers: this.getAuthHeaders() }
    );
  }


  bulkUpdateStatus(ids: string[], status: PurchaseOrderStatus): Observable<PurchaseOrder[]> {
    return this.http.post<PurchaseOrder[]>(
      `${this.apiUrl}/bulk/status`,
      { ids, status },
      { headers: this.getAuthHeaders() }
    );
  }


  getStatistics(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/statistics`,
      { headers: this.getAuthHeaders() }
    );
  }

  // ================= ORDER LINES =================

  updateOrderLine(orderId: string, lineId: string, data: any): Observable<OrderLine> {
    return this.http.put<OrderLine>(
      `${this.apiUrl}/${orderId}/lines/${lineId}`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  addOrderLine(orderId: string, line: any): Observable<OrderLine> {
    return this.http.post<OrderLine>(
      `${this.apiUrl}/${orderId}/lines`,
      line,
      { headers: this.getAuthHeaders() }
    );
  }

  removeOrderLine(orderId: string, lineId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${orderId}/lines/${lineId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
