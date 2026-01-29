import { createAction, props } from '@ngrx/store';
import { Shipment } from './shipments.state';

export const loadShipments = createAction(
  '[ShipmentsComponent] Load ShipmentsComponent',
  props<{ page?: number; pageSize?: number }>()
);

export const loadShipmentsSuccess = createAction(
  '[ShipmentsComponent] Load ShipmentsComponent Success',
  props<{ shipments: Shipment[]; total: number }>()
);

export const loadShipmentsFailure = createAction(
  '[ShipmentsComponent] Load ShipmentsComponent Failure',
  props<{ error: string }>()
);

export const loadShipment = createAction(
  '[ShipmentsComponent] Load Shipment',
  props<{ trackingNumber: string }>()
);

export const loadShipmentSuccess = createAction(
  '[ShipmentsComponent] Load Shipment Success',
  props<{ shipment: Shipment }>()
);

export const loadShipmentFailure = createAction(
  '[ShipmentsComponent] Load Shipment Failure',
  props<{ error: string }>()
);

// Create Shipment
export const createShipment = createAction(
  '[ShipmentsComponent] Create Shipment',
  props<{ shipment: Omit<Shipment, 'trackingNumber'> }>()
);

export const createShipmentSuccess = createAction(
  '[ShipmentsComponent] Create Shipment Success',
  props<{ shipment: Shipment }>()
);

export const createShipmentFailure = createAction(
  '[ShipmentsComponent] Create Shipment Failure',
  props<{ error: string }>()
);

export const updateShipment = createAction(
  '[ShipmentsComponent] Update Shipment',
  props<{ trackingNumber: string; shipment: Partial<Shipment> }>()
);

export const updateShipmentSuccess = createAction(
  '[ShipmentsComponent] Update Shipment Success',
  props<{ shipment: Shipment }>()
);

export const updateShipmentFailure = createAction(
  '[ShipmentsComponent] Update Shipment Failure',
  props<{ error: string }>()
);

// Delete Shipment
export const deleteShipment = createAction(
  '[ShipmentsComponent] Delete Shipment',
  props<{ trackingNumber: string }>()
);

export const deleteShipmentSuccess = createAction(
  '[ShipmentsComponent] Delete Shipment Success',
  props<{ trackingNumber: string }>()
);

export const deleteShipmentFailure = createAction(
  '[ShipmentsComponent] Delete Shipment Failure',
  props<{ error: string }>()
);

// Search ShipmentsComponent
export const searchShipments = createAction(
  '[ShipmentsComponent] Search ShipmentsComponent',
  props<{ query: string }>()
);

// Set Pagination
export const setPagination = createAction(
  '[ShipmentsComponent] Set Pagination',
  props<{ page: number; pageSize: number }>()
);

// Clear selected
export const clearSelectedShipment = createAction(
  '[ShipmentsComponent] Clear Selected Shipment'
);
