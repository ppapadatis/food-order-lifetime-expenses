import type { FOOD_SERVICE } from './constants.ts';

export type FoodService = (typeof FOOD_SERVICE)[keyof typeof FOOD_SERVICE];

export interface EfoodOrder {
  status: string;
  price: number;
  restaurant: { id: number; name: string };
  submission_date: string;
}

export interface BoxOrder {
  shopResponse: { status: string };
  totalPrice: number;
  shop: { _id: string; name: string };
  createdAt: string;
}

export interface WoltOrder {
  status: string;
  total_price: number;
  venue_id: string;
  venue_name: string;
  delivery_time: { $date: number };
}

export type FoodOrder = EfoodOrder | BoxOrder | WoltOrder;

export type ShopCost = { id: string | number; restaurant: string; orders: number; price: number };
