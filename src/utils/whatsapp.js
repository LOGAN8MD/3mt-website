import { formatCurrency } from './currency';

export const BUSINESS_CONTACT = Object.freeze({
  displayPhone: '+91 8286104286',
  telephone: '+918286104286',
  whatsapp: '918286104286',
});

export const getTelephoneUrl = () => `tel:${BUSINESS_CONTACT.telephone}`;

export const buildWhatsAppUrl = (message) =>
  `https://wa.me/${BUSINESS_CONTACT.whatsapp}?text=${encodeURIComponent(message.trim())}`;

export const openWhatsApp = (message) => {
  const openedWindow = window.open(
    buildWhatsAppUrl(message),
    '_blank',
    'noopener,noreferrer'
  );

  if (openedWindow) {
    openedWindow.opener = null;
  }
};

export const buildGeneralEnquiryMessage = () =>
  'Hello Team 3MT, I want to know more about your products and services.';

export const buildProductEnquiryMessage = (product, quantity) => {
  const selectedQuantity = Number(quantity) || 1;
  const estimatedPrice = Number(product?.price || 0) * selectedQuantity;

  return [
    'Hello 3MT, I would like to enquire about this product:',
    '',
    `Product Name: ${product?.name || 'Product'}`,
    `Quantity: ${selectedQuantity}`,
    `Estimated Price: ${formatCurrency(estimatedPrice)}`,
  ].join('\n');
};

export const buildCartEnquiryMessage = (cartItems) => {
  const itemLines = cartItems.map((item, index) => {
    const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);

    return `${index + 1}. ${item.name} - Quantity: ${item.quantity} - Price: ${formatCurrency(lineTotal)}`;
  });

  const cartTotal = cartItems.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  return [
    'Hello 3MT, I would like to enquire about the following products:',
    '',
    ...itemLines,
    '',
    `Total Estimated Price: ${formatCurrency(cartTotal)}`,
  ].join('\n');
};
