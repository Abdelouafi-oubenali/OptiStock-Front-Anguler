import { createReducer, on } from '@ngrx/store';
import { initialShipmentsState, ShipmentsState } from './shipments.state';
import * as ShipmentsActions from './shipments.actions';

export const shipmentsReducer = createReducer(
  initialShipmentsState,

  // Load ShipmentsComponent
  on(ShipmentsActions.loadShipments, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ShipmentsActions.loadShipmentsSuccess, (state, { shipments, total }) => ({
    ...state,
    shipments,
    total,
    loading: false,
    error: null,
  })),

  on(ShipmentsActions.loadShipmentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Single Shipment
  on(ShipmentsActions.loadShipment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ShipmentsActions.loadShipmentSuccess, (state, { shipment }) => ({
    ...state,
    selectedShipment: shipment,
    loading: false,
    error: null,
  })),

  on(ShipmentsActions.loadShipmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Shipment
  on(ShipmentsActions.createShipment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ShipmentsActions.createShipmentSuccess, (state, { shipment }) => ({
    ...state,
    shipments: [...state.shipments, shipment],
    loading: false,
    error: null,
  })),

  // Update Shipment
  on(ShipmentsActions.updateShipment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ShipmentsActions.updateShipmentSuccess, (state, { shipment }) => ({
    ...state,
    shipments: state.shipments.map((s) =>
      s.trackingNumber === shipment.trackingNumber ? shipment : s
    ),
    selectedShipment: shipment,
    loading: false,
    error: null,
  })),

  // Delete Shipment
  on(ShipmentsActions.deleteShipment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ShipmentsActions.deleteShipmentSuccess, (state, { shipmentId }) => ({
    ...state,
    shipments: state.shipments.filter(
      (s) => s.id !== shipmentId
    ),
    loading: false,
    error: null,
    selectedShipment:
      state.selectedShipment?.id === shipmentId
        ? null
        : state.selectedShipment,
  })),

  // Set Pagination
  on(ShipmentsActions.setPagination, (state, { page, pageSize }) => ({
    ...state,
    page,
    pageSize,
  })),

  // Clear Selected
  on(ShipmentsActions.clearSelectedShipment, (state) => ({
    ...state,
    selectedShipment: null,
  })),

  // Handle all failures
  on(
    ShipmentsActions.createShipmentFailure,
    ShipmentsActions.updateShipmentFailure,
    ShipmentsActions.deleteShipmentFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })
  )
);
