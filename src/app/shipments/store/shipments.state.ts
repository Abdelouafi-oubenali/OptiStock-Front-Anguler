export interface Shipment {
  trackingNumber: string;
  status: 'IN_TRANSIT' | 'DELIVERED' | 'PENDING' | 'CANCELLED';
  plannedDate: string;
  shippedDate?: string;
  deliveredDate?: string;
  salesOrderId: string;
  carrierId: string;
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
