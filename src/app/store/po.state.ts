import { PurchaseOrderState, purchaseOrderReducer } from '../purchase-orders/po.reducer';

export interface AppState {
  purchaseOrders: PurchaseOrderState;
}

export const appReducers = {
  purchaseOrders: purchaseOrderReducer,
};
