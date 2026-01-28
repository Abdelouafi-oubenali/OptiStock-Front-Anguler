export interface OrderLineCreate {
  productId: string | null;
  quantity: number;
  unitPrice: number;
}

export interface OrderLine extends OrderLineCreate {
  id?: string;
  purchaseOrderId?: string;
  productName?: string;
  total?: number;
  receivedQuantity?: number;
  status?: OrderLineStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderLineStatus = 'PENDING' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';
