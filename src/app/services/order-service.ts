import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SalseOrder  , SalesOrderLine}   from '../orders/order-models';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrlSalesOrder = 'http://161.97.128.217:8081/api/sales-orders';
  private apiUrlSalesOrderLine = 'http://161.97.128.217:8081/api/sales-order-lines';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

  }

    getSalseOrders(): Observable<SalseOrder[]>{
      const headers = this.getAuthHeaders();
      return this.http.get<SalseOrder[]>(this.apiUrlSalesOrder, { headers });
    }

  getSalseOrderLines(): Observable<SalesOrderLine[]>{
    const headers = this.getAuthHeaders();
    return this.http.get<SalesOrderLine[]>(this.apiUrlSalesOrderLine, { headers });
  }


  createSalesOrder(order: SalseOrder): Observable<SalseOrder> {
    return this.http.post<SalseOrder>(
      this.apiUrlSalesOrder,
      order,
      { headers: this.getAuthHeaders() }
    );
  }

  createSalesOrderLine(orderLine: SalesOrderLine): Observable<SalesOrderLine> {
    return this.http.post<SalesOrderLine>(
      this.apiUrlSalesOrderLine,
      orderLine,
      { headers: this.getAuthHeaders() }
    );
  }
}
