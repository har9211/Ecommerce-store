export const SHIPPING_PRICE = 49;
export const FREE_SHIPPING_THRESHOLD = 999;

export function calculateDeliveryPrice(itemsPrice) {
  return itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_PRICE;
}
