
export interface Product {
  id: string;
  name: string;
  description: string;
  imageColor: string; // Hex color for placeholder
  ingredients: string[];
  youtubeId?: string;
  videoStart?: number; // Start time in seconds
  videoEnd?: number;   // End time in seconds
}

export enum OrderSize {
  SevenShots = '7-Pack (2oz shots)',
  TwelveOunce = '12oz Bottle',
}

export const ProductPrices: Record<OrderSize, number> = {
  [OrderSize.SevenShots]: 50,
  [OrderSize.TwelveOunce]: 45,
};

export interface CartItem {
  productId: string;
  productName: string;
  size: OrderSize;
  quantity: number;
}

export enum GroupName {
  GroupA = 'Group A (Pathfinders)',
  GroupB = 'Group B (Adventurers)',
  GroupC = 'Group C (Youth)',
  GroupD = 'Group D (Young Adults)',
}

export type DeliveryOption = 'Pickup' | 'Delivery';

export interface Order {
  id: string;
  customerName: string;
  customerContact: string;
  items: CartItem[];
  assignedGroup: GroupName;
  orderDate: string; // ISO string
  isFulfilled: boolean;
  totalPrice: number;
  donationAmount: number;
  deliveryOption: DeliveryOption;
  deliveryAddress?: string;
  orderNumber: string;
  zelleConfirmationNumber: string;
  isRecurring: boolean;
}

export interface ScheduleEvent {
    date: string; // ISO string
    group: GroupName;
}
