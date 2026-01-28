import { createAction, props } from '@ngrx/store';
import { PurchaseOrderCreate } from './models/purchase-order-create.model';
import { PurchaseOrder, PurchaseOrderUpdate, PurchaseOrderFilter, PurchaseOrderStatus } from './purchase-order.model';

// Load Purchase Orders
export const loadPurchaseOrders = createAction(
  '[PO] Load Purchase Orders',
  props<{ filter?: PurchaseOrderFilter }>()
);

export const loadPurchaseOrdersSuccess = createAction(
  '[PO] Load Purchase Orders Success',
  props<{ orders: PurchaseOrder[] }>()
);

export const loadPurchaseOrdersFailure = createAction(
  '[PO] Load Purchase Orders Failure',
  props<{ error: string }>()
);

// Load Single Purchase Order
export const loadPurchaseOrder = createAction(
  '[PO] Load Purchase Order',
  props<{ id: string }>()
);

export const loadPurchaseOrderSuccess = createAction(
  '[PO] Load Purchase Order Success',
  props<{ order: PurchaseOrder }>()
);

export const loadPurchaseOrderFailure = createAction(
  '[PO] Load Purchase Order Failure',
  props<{ error: string }>()
);

// Create Purchase Order
export const createPurchaseOrder = createAction(
  '[PO] Create Purchase Order',
  props<{ order: PurchaseOrderCreate }>()
);

export const createPurchaseOrderSuccess = createAction(
  '[PO] Create Purchase Order Success',
  props<{ order: PurchaseOrder }>()
);

export const createPurchaseOrderFailure = createAction(
  '[PO] Create Purchase Order Failure',
  props<{ error: string }>()
);

// Update Purchase Order
export const updatePurchaseOrder = createAction(
  '[PO] Update Purchase Order',
  props<{ id: string; updates: PurchaseOrderUpdate }>()
);

export const updatePurchaseOrderSuccess = createAction(
  '[PO] Update Purchase Order Success',
  props<{ order: PurchaseOrder }>()
);

export const updatePurchaseOrderFailure = createAction(
  '[PO] Update Purchase Order Failure',
  props<{ error: string }>()
);

// Delete Purchase Order
export const deletePurchaseOrder = createAction(
  '[PO] Delete Purchase Order',
  props<{ id: string }>()
);

export const deletePurchaseOrderSuccess = createAction(
  '[PO] Delete Purchase Order Success',
  props<{ id: string }>()
);

export const deletePurchaseOrderFailure = createAction(
  '[PO] Delete Purchase Order Failure',
  props<{ error: string }>()
);

// Update Purchase Order Status
export const updatePurchaseOrderStatus = createAction(
  '[PO] Update Purchase Order Status',
  props<{ id: string; status: PurchaseOrderStatus }>()
);

export const updatePurchaseOrderStatusSuccess = createAction(
  '[PO] Update Purchase Order Status Success',
  props<{ order: PurchaseOrder }>()
);

export const updatePurchaseOrderStatusFailure = createAction(
  '[PO] Update Purchase Order Status Failure',
  props<{ error: string }>()
);

// Bulk Update Purchase Order Status
export const bulkUpdatePurchaseOrderStatus = createAction(
  '[PO] Bulk Update Purchase Order Status',
  props<{ ids: string[]; status: PurchaseOrderStatus }>()
);

export const bulkUpdatePurchaseOrderStatusSuccess = createAction(
  '[PO] Bulk Update Purchase Order Status Success',
  props<{ orders: PurchaseOrder[] }>()
);

export const bulkUpdatePurchaseOrderStatusFailure = createAction(
  '[PO] Bulk Update Purchase Order Status Failure',
  props<{ error: string }>()
);

// Clear Actions
export const clearSelectedPurchaseOrder = createAction(
  '[PO] Clear Selected Purchase Order'
);

export const clearPurchaseOrders = createAction(
  '[PO] Clear Purchase Orders'
);

// Legacy actions (kept for backward compatibility)
export const createPO = createAction(
  '[PO] Create',
  props<{ po: PurchaseOrderCreate }>()
);

export const createPOSuccess = createAction(
  '[PO] Create Success'
);

export const createPOFailure = createAction(
  '[PO] Create Failure',
  props<{ error: string }>()
);
