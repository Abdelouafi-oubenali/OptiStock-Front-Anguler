import { OrderLineCreate } from './order-line.model';

export interface PurchaseOrderCreate {
  supplierId: string;
  createdByUserId?: string;
  expectedDelivery: Date;
  status?: string;
  totalAmount?: number;
  orderLines: OrderLineCreate[];
}
