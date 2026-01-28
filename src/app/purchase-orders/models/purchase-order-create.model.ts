import { OrderLineCreate } from './order-line.model';

export interface PurchaseOrderCreate {
  supplierId: string;
  createdByUserId?: string;
  expectedDelivery: string | Date;
  status?: string;
  totalAmount?: number;
  shippingAddress?: string;
  billingAddress?: string;
  notes?: string;
  orderLines: OrderLineCreate[];
}
