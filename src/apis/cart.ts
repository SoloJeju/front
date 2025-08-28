import axios from 'axios';
import type { CartListResponse } from '../types/cart';

export const getCartList = async (): Promise<CartListResponse> => {
  const { data } = await axios.get('/api/spot-cart');
  return data;
};

export const addToCart = async (contentId: number, sortOrder = 1) => {
  const { data } = await axios.post('/api/spot-cart', {contentId, sortOrder});
  return data;
};

export const deleteCartItem = async (cartId: number) => {
  const { data } = await axios.delete(`/api/spot-cart/${cartId}`);
  return data;
};

export const bulkDeleteCart = async (cartIds: number[]) => {
  const { data } = await axios.delete('/api/spot-cart/bulk', {
    data: { cartIds },
  });
  return data;
};

export const clearCart = async () => {
  const { data } = await axios.delete('/api/spot-cart');
  return data;
};
