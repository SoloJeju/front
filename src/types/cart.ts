import type { CommonResponse } from './common';

export interface CartItem {
  cartId: number;
  contentId: number;
  name: string;
  address: string | null;
  firstImage: string;
  contentTypeId: number;
  difficulty: string;
  sortOrder: number;
  addedAt: string;
}

export interface CartListResult {
  items: CartItem[];
  totalCount: number;
}

export type CartListResponse = CommonResponse<CartListResult>;

export type PlaceCardProps = {
  cartId: number;
  firstImage?: string;
  name: string;
  address?: string|null;
  isEditMode: boolean;
  isSelected: boolean;
  onSelectToggle: () => void;
};
