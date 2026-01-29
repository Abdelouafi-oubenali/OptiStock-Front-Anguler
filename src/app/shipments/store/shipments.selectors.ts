import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ShipmentsState } from './shipments.state';

export const selectShipmentsState = createFeatureSelector<ShipmentsState>('shipments');

export const selectAllShipments = createSelector(
  selectShipmentsState,
  (state) => state.shipments
);

export const selectSelectedShipment = createSelector(
  selectShipmentsState,
  (state) => state.selectedShipment
);

export const selectShipmentsLoading = createSelector(
  selectShipmentsState,
  (state) => state.loading
);

export const selectShipmentsError = createSelector(
  selectShipmentsState,
  (state) => state.error
);

export const selectShipmentsTotal = createSelector(
  selectShipmentsState,
  (state) => state.total
);

export const selectShipmentsPagination = createSelector(
  selectShipmentsState,
  (state) => ({
    page: state.page,
    pageSize: state.pageSize,
    total: state.total,
  })
);

// Select shipment by tracking number
export const selectShipmentByTrackingNumber = (trackingNumber: string) =>
  createSelector(
    selectAllShipments,
    (shipments) => shipments.find(s => s.trackingNumber === trackingNumber)
  );

// Filter shipments by status
export const selectShipmentsByStatus = (status: string) =>
  createSelector(
    selectAllShipments,
    (shipments) => shipments.filter(s => s.status === status)
  );
