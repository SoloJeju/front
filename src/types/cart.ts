import type { CommonResponse } from './common';

export interface CartItem {
  contentid: number;
  contenttypeid: number;
  title: string;
  addr1: string | null;
  firstimage?: string;
}

export interface CartListResult {
  list: CartItem[];
  totalCount?: number;
}

export type CartListResponse = CommonResponse<CartListResult>;

export type PlaceCardProps = {
  contentid: number;
  contenttypeid: number;
  firstimage?: string;
  title: string;
  addr1?: string|null;
  isEditMode: boolean;
  isSelected: boolean;
  onSelectToggle: () => void;
};
