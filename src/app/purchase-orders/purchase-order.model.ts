import { OrderLine } from './models/order-line.model';

export interface PurchaseOrder {
  id?: string;
  reference?: string;
  supplierId?: string;
  supplierName?: string;
  createdByUserId?: string;
  createdByUserName?: string;
  approvedByUserId?: string;
  status: PurchaseOrderStatus;
  orderDate?: Date;
  expectedDelivery?: Date;
  actualDelivery?: Date;
  shippingAddress?: string;
  billingAddress?: string;
  totalAmount?: number;
  totalTax?: number;
  grandTotal?: number;
  notes?: string;
  orderLines?: OrderLine[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type PurchaseOrderStatus =
  | 'DRAFT'
  | 'CREATED'
  | 'RECEIVED'
  | 'APPROVED'
  | 'CANCELLED';

export interface PurchaseOrderUpdate {
  expectedDelivery?: Date;
  shippingAddress?: string;
  billingAddress?: string;
  notes?: string;
  status?: PurchaseOrderStatus;
}

export interface PurchaseOrderFilter {
  status?: PurchaseOrderStatus;
  supplierId?: string;
  startDate?: Date;
  endDate?: Date;
  reference?: string;
}
