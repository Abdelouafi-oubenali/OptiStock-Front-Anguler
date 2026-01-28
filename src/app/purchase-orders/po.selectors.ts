import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PurchaseOrderState } from './po.reducer';

export const selectPurchaseOrderState = createFeatureSelector<PurchaseOrderState>('purchaseOrders');

export const selectAllPurchaseOrders = createSelector(
  selectPurchaseOrderState,
  (state) => state.orders
);

export const selectSelectedPurchaseOrder = createSelector(
  selectPurchaseOrderState,
  (state) => state.selectedOrder
);

export const selectPurchaseOrdersLoading = createSelector(
  selectPurchaseOrderState,
  (state) => state.loading
);

export const selectPurchaseOrdersError = createSelector(
  selectPurchaseOrderState,
  (state) => state.error
);

export const selectPurchaseOrdersCreating = createSelector(
  selectPurchaseOrderState,
  (state) => state.creating
);

export const selectPurchaseOrdersUpdating = createSelector(
  selectPurchaseOrderState,
  (state) => state.updating
);

export const selectPurchaseOrdersDeleting = createSelector(
  selectPurchaseOrderState,
  (state) => state.deleting
);

export const selectPurchaseOrdersByStatus = (status: string) =>
  createSelector(
    selectAllPurchaseOrders,
    (orders) => orders.filter(order => order.status === status)
  );

export const selectPurchaseOrdersBySupplier = (supplierId: string) =>
  createSelector(
    selectAllPurchaseOrders,
    (orders) => orders.filter(order => order.supplierId === supplierId)
  );

// Statistics selectors
export const selectPurchaseOrdersStatistics = createSelector(
  selectAllPurchaseOrders,
  (orders) => {
    const stats = {
      total: orders.length,
      draft: orders.filter(o => o.status === 'DRAFT').length,
      created: orders.filter(o => o.status === 'CREATED').length,
      approved: orders.filter(o => o.status === 'APPROVED').length,
      received: orders.filter(o => o.status === 'RECEIVED').length,
      cancelled: orders.filter(o => o.status === 'CANCELLED').length,
      totalAmount: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    };

    return stats;
  }
);

export const selectActivePurchaseOrders = createSelector(
  selectAllPurchaseOrders,
  (orders) => orders.filter(order =>
    ['DRAFT', 'CREATED', 'APPROVED'].includes(order.status)
  )
);

export const selectCompletedPurchaseOrders = createSelector(
  selectAllPurchaseOrders,
  (orders) => orders.filter(order => order.status === 'RECEIVED')
);

export const selectCancelledPurchaseOrders = createSelector(
  selectAllPurchaseOrders,
  (orders) => orders.filter(order => order.status === 'CANCELLED')
);
