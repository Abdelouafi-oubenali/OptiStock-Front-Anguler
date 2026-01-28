import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PurchaseOrder } from '../purchase-order.model';
import { PurchaseOrderStatus } from '../purchase-order.model';
import * as PoActions from '../po.actions';
import * as PoSelectors from '../po.selectors';
import { PoFormComponent } from './po-form.component';

@Component({
  selector: 'app-po-list',
  standalone: true,
  imports: [CommonModule, PoFormComponent],
  templateUrl: './po-list.component.html'
})
export class PoListComponent implements OnInit {
  orders$: Observable<PurchaseOrder[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  showForm = false;
  isEditMode = false;
  editingOrder?: PurchaseOrder;

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
    const order = this.orders$;
    // You can implement navigation or open form for editing
    console.log('Edit order:', id);
  }

  openCreateForm() {
    this.showForm = true;
    this.isEditMode = false;
    this.editingOrder = undefined;
  }

  openEditForm(order: PurchaseOrder) {
    this.showForm = true;
    this.isEditMode = true;
    this.editingOrder = order;
  }

  onFormSave(po: PurchaseOrder) {
    if (this.isEditMode && po.id) {
      this.store.dispatch(PoActions.updatePurchaseOrder({ 
        id: po.id, 
        updates: {
          status: po.status,
          expectedDelivery: po.expectedDelivery,
          shippingAddress: po.shippingAddress,
          billingAddress: po.billingAddress,
          notes: po.notes
        } 
      }));
    } else {
      // Create new PO with all provided fields
      let expectedDeliveryISO = po.expectedDelivery || new Date().toISOString();
      
      // Si c'est une date string au format YYYY-MM-DD, convertir en ISO
      if (typeof expectedDeliveryISO === 'string' && !expectedDeliveryISO.includes('T')) {
        expectedDeliveryISO = new Date(expectedDeliveryISO).toISOString();
      }

      const poCreate = {
        supplierId: po.supplierId || '',
        createdByUserId: po.createdByUserId,
        expectedDelivery: expectedDeliveryISO,
        status: po.status || 'DRAFT',
        shippingAddress: po.shippingAddress || '',
        billingAddress: po.billingAddress || '',
        notes: po.notes || '',
        orderLines: (po.orderLines || []).map(line => {
          // Ensure productId is a string, not an Event object
          let productId = line.productId;
          if (productId && typeof productId === 'object' && (productId as any).target) {
            productId = (productId as any).target.value;
          }
          
          return {
            productId: String(productId || ''),
            quantity: Number(line.quantity) || 0,
            unitPrice: Number(line.unitPrice) || 0
          };
        })
      };
      console.log('Sending PO:', poCreate);
      this.store.dispatch(PoActions.createPurchaseOrder({ order: poCreate as any }));
    }
    this.closeForm();
  }

  private convertToDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
      return new Date(value);
    }
    return null;
  }

  onFormCancel() {
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
    this.isEditMode = false;
    this.editingOrder = undefined;
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

  getTotalAmount(order: PurchaseOrder): number {
    // If totalAmount exists, use it
    if (order.totalAmount) {
      return order.totalAmount;
    }
    // Otherwise, calculate from order lines
    if (order.orderLines && order.orderLines.length > 0) {
      return order.orderLines.reduce((sum, line) => sum + (line.total || 0), 0);
    }
    return 0;
  }
}
