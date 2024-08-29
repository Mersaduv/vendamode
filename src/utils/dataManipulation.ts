import { SizeDTO } from '@/services/feature/types';
import type { ICart, IColorDTO, IObjectValue } from '@/types';

export function exsitItem(cartItems: ICart[], productID: string, color: IColorDTO | null, size: SizeDTO | null, features: IObjectValue | null) {
  let result;
  if (color && size && features) {
    result = cartItems.find((item) => item.productID === productID && item.color?.id === color.id && item.size?.id === size.id && item.features?.value![0].id === features.value![0].id);
  } else if (color && size) {
    result = cartItems.find((item) => item.productID === productID && item.color?.id === color.id && item.size?.id === size.id);
  } else if (color && features) {
    result = cartItems.find((item) => item.productID === productID && item.color?.id === color.id && item.features?.value![0].id === features.value![0].id);
  } else if (size && features) {
    result = cartItems.find((item) => item.productID === productID && item.size?.id === size.id && item.features?.value![0].id === features.value![0].id);
  } else if (color) {
    result = cartItems.find((item) => item.productID === productID && item.color?.id === color.id);
  } else if (size) {
    result = cartItems.find((item) => item.productID === productID && item.size?.id === size.id);
  } else if (features) {
    result = cartItems.find((item) => item.productID === productID && item.features?.value![0].id === features.value![0].id);
  } else {
    result = cartItems.find((item) => item.productID === productID);
  }

  return result;
}

export function getTotal(items: ICart[], attr: string): number {
  const result = items.reduce((total, item) => {
    if (attr === 'price') {
      total += item.price * item.quantity;
    } else if (attr === 'quantity') {
      total += item.quantity;
    } else if (attr === 'discount') {
      total += item.discount * item.quantity;
    }
    return total;
  }, 0);

  return result;
}