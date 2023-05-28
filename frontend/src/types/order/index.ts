export interface IOrder {
  id: number;
  hall: number;
  order_from: string;
  order_till: string;
  price: string;
  ordered_by: number;
  current_status: string;
}
