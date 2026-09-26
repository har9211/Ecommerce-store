const SHIPPING_PRICE = 49;
const FREE_SHIPPING_THRESHOLD = 999;

function calculateDeliveryPrice(itemsPrice) {
  return itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_PRICE;
}

module.exports = { SHIPPING_PRICE, FREE_SHIPPING_THRESHOLD, calculateDeliveryPrice };
