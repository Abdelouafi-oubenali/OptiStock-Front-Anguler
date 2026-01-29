export interface Shipment {
  id: string;
  trackingNumber: string;
  status: 'PLANNED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'SHIPPED' | 'PENDING';
  plannedDate: string;
  shippedDate?: string;
  deliveredDate?: string;
  salesOrderId: string;
}

export interface ShipmentsState {
  shipments: Shipment[];
  selectedShipment: Shipment | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
}

export const initialShipmentsState: ShipmentsState = {
  shipments: [],
  selectedShipment: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 10,
};
