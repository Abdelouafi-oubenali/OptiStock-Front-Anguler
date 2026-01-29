import { PurchaseOrderState, purchaseOrderReducer } from '../purchase-orders/po.reducer';
import { ShipmentsState } from '../shipments/store/shipments.state';
import { shipmentsReducer } from '../shipments/store/shipments.reducer';

export interface AppState {
  purchaseOrders: PurchaseOrderState;
  shipments: ShipmentsState;
}

export const appReducers = {
  purchaseOrders: purchaseOrderReducer,
  shipments: shipmentsReducer,
};
