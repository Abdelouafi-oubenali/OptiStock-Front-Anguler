export interface SalseOrder {
  id?: string;
  user_id: string
  orderStatus: string
}

export interface SalesOrderLine  {
  product_id?: string,
  sales_order_id: string,
  quantity: number,
  unitPrice: number
}
