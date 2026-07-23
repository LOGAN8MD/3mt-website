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

const getCustomerName = (customer) => {
  const fullName = customer?.name?.trim();
  if (fullName) return fullName;

  return [customer?.firstName, customer?.lastName]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(' ');
};

const buildGreeting = (customer, enquiryText) => {
  const customerName = getCustomerName(customer);

  return customerName
    ? `Hello 3MT, I am ${customerName}. I would like to enquire about ${enquiryText}.`
    : `Hello 3MT, I would like to enquire about ${enquiryText}.`;
};

const buildCustomerDetailLines = (customer) => {
  const details = [
    customer?.email?.trim() ? `Email: ${customer.email.trim()}` : null,
    customer?.phone?.trim() ? `Phone: ${customer.phone.trim()}` : null,
    customer?.address?.trim() ? `Address: ${customer.address.trim()}` : null,
  ].filter(Boolean);

  return details.length > 0 ? ['', 'My Details:', ...details] : [];
};

export const buildProductEnquiryMessage = (product, quantity, customer) => {
  const selectedQuantity = Number(quantity) || 1;
  const estimatedPrice = Number(product?.price || 0) * selectedQuantity;

  return [
    buildGreeting(customer, 'this product'),
    '',
    'Product Details:',
    `Product Name: ${product?.name || 'Product'}`,
    `Quantity: ${selectedQuantity}`,
    `Estimated Price: ${formatCurrency(estimatedPrice)}`,
    ...buildCustomerDetailLines(customer),
  ].join('\n');
};

export const buildCartEnquiryMessage = (cartItems, customer) => {
  const itemLines = cartItems.map((item, index) => {
    const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);

    return `${index + 1}. ${item.name} - Quantity: ${item.quantity} - Price: ${formatCurrency(lineTotal)}`;
  });

  const cartTotal = cartItems.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  return [
    buildGreeting(customer, 'the following products'),
    '',
    'Product Details:',
    ...itemLines,
    '',
    `Total Estimated Price: ${formatCurrency(cartTotal)}`,
    ...buildCustomerDetailLines(customer),
  ].join('\n');
};
