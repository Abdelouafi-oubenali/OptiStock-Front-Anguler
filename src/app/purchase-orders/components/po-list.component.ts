import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PurchaseOrder } from '../purchase-order.model';
import { PurchaseOrderStatus } from '../purchase-order.model';
import * as PoActions from '../po.actions';
import * as PoSelectors from '../po.selectors';

@Component({
  selector: 'app-po-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './po-list.component.html'
})
export class PoListComponent implements OnInit {
  orders$: Observable<PurchaseOrder[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  statuses: PurchaseOrderStatus[] = [
    'DRAFT', 'CREATED', 'RECEIVED', 'APPROVED', 'CANCELLED'
  ];

  constructor(private store: Store) {
    this.orders$ = this.store.select(PoSelectors.selectAllPurchaseOrders);
    this.loading$ = this.store.select(PoSelectors.selectPurchaseOrdersLoading);
    this.error$ = this.store.select(PoSelectors.selectPurchaseOrdersError);
  }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.store.dispatch(PoActions.loadPurchaseOrders({}));
  }

  viewOrder(id: string) {
    this.store.dispatch(PoActions.loadPurchaseOrder({ id }));
  }

  editOrder(id: string) {
  }

  deleteOrder(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.store.dispatch(PoActions.deletePurchaseOrder({ id }));
    }
  }

  updateStatus(id: string, status: PurchaseOrderStatus) {
    if (status) {
      this.store.dispatch(PoActions.updatePurchaseOrderStatus({ id, status }));
    }
  }

  onStatusChange(id: string, event: Event) {
    const select = event.target as HTMLSelectElement;
    const status = select.value as PurchaseOrderStatus;
    this.updateStatus(id, status);
  }

  onStatusFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const status = select.value as PurchaseOrderStatus;

    if (status) {
      this.store.dispatch(PoActions.loadPurchaseOrders({ filter: { status } }));
    } else {
      this.store.dispatch(PoActions.loadPurchaseOrders({}));
    }
  }

  getAvailableStatuses(currentStatus: PurchaseOrderStatus): PurchaseOrderStatus[] {
    const workflow: Record<PurchaseOrderStatus, PurchaseOrderStatus[]> = {
      'DRAFT': ['CREATED', 'CANCELLED'],
      'CREATED': ['APPROVED', 'CANCELLED'],
      'APPROVED': ['RECEIVED', 'CANCELLED'],
      'RECEIVED': [],
      'CANCELLED': []
    };

    return workflow[currentStatus] || [];
  }

  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    switch(statusLower) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'created':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-purple-100 text-purple-800';
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
