import { createReducer, on } from '@ngrx/store';
import * as PoActions from './po.actions';
import { PurchaseOrder } from './purchase-order.model';

export interface PurchaseOrderState {
  orders: PurchaseOrder[];
  selectedOrder: PurchaseOrder | null;
  loading: boolean;
  error: string | null;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
}

export const initialState: PurchaseOrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false
};

export const purchaseOrderReducer = createReducer(
  initialState,

  // Load Purchase Orders
  on(PoActions.loadPurchaseOrders, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(PoActions.loadPurchaseOrdersSuccess, (state, { orders }) => ({
    ...state,
    orders,
    loading: false
  })),
  on(PoActions.loadPurchaseOrdersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(PoActions.loadPurchaseOrder, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(PoActions.loadPurchaseOrderSuccess, (state, { order }) => ({
    ...state,
    selectedOrder: order,
    loading: false
  })),
  on(PoActions.loadPurchaseOrderFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(PoActions.createPurchaseOrder, state => ({
    ...state,
    creating: true,
    error: null
  })),
  on(PoActions.createPurchaseOrderSuccess, (state, { order }) => ({
    ...state,
    orders: [...state.orders, order],
    creating: false
  })),
  on(PoActions.createPurchaseOrderFailure, (state, { error }) => ({
    ...state,
    error,
    creating: false
  })),


  on(PoActions.updatePurchaseOrder, state => ({
    ...state,
    updating: true,
    error: null
  })),
  on(PoActions.updatePurchaseOrderSuccess, (state, { order }) => ({
    ...state,
    orders: state.orders.map(o => o.id === order.id ? order : o),
    selectedOrder: order.id === state.selectedOrder?.id ? order : state.selectedOrder,
    updating: false
  })),
  on(PoActions.updatePurchaseOrderFailure, (state, { error }) => ({
    ...state,
    error,
    updating: false
  })),


  on(PoActions.deletePurchaseOrder, state => ({
    ...state,
    deleting: true,
    error: null
  })),
  on(PoActions.deletePurchaseOrderSuccess, (state, { id }) => ({
    ...state,
    orders: state.orders.filter(order => order.id !== id),
    selectedOrder: state.selectedOrder?.id === id ? null : state.selectedOrder,
    deleting: false
  })),
  on(PoActions.deletePurchaseOrderFailure, (state, { error }) => ({
    ...state,
    error,
    deleting: false
  })),

  // Update Status
  on(PoActions.updatePurchaseOrderStatus, state => ({
    ...state,
    updating: true,
    error: null
  })),
  on(PoActions.updatePurchaseOrderStatusSuccess, (state, { order }) => ({
    ...state,
    orders: state.orders.map(o => o.id === order.id ? order : o),
    selectedOrder: order.id === state.selectedOrder?.id ? order : state.selectedOrder,
    updating: false
  })),
  on(PoActions.updatePurchaseOrderStatusFailure, (state, { error }) => ({
    ...state,
    error,
    updating: false
  })),

  // Bulk Update Status
  on(PoActions.bulkUpdatePurchaseOrderStatus, state => ({
    ...state,
    updating: true,
    error: null
  })),
  on(PoActions.bulkUpdatePurchaseOrderStatusSuccess, (state, { orders }) => ({
    ...state,
    orders: state.orders.map(order => {
      const updatedOrder = orders.find(o => o.id === order.id);
      return updatedOrder || order;
    }),
    updating: false
  })),
  on(PoActions.bulkUpdatePurchaseOrderStatusFailure, (state, { error }) => ({
    ...state,
    error,
    updating: false
  })),

  // Clear Actions
  on(PoActions.clearSelectedPurchaseOrder, state => ({
    ...state,
    selectedOrder: null
  })),
  on(PoActions.clearPurchaseOrders, state => ({
    ...state,
    orders: []
  }))
);
