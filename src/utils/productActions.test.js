import { getProductActions } from './productActions';
import { buildProductEnquiryMessage } from './whatsapp';

test.each(['sold', 'unavailable'])('%s blocks both purchase and rental actions', (availabilityStatus) => {
  for (const intent of ['sale', 'rent']) {
    expect(getProductActions({ availabilityType: 'both', availabilityStatus, stock: 3 }, intent)).toMatchObject({ canAdd: false, canEnquire: false });
  }
});

test('on-rent machines allow future rental enquiry only', () => {
  const product = { availabilityType: 'both', availabilityStatus: 'on_rent', stock: 1 };
  expect(getProductActions(product, 'rent')).toMatchObject({ canEnquire: true, canAdd: false });
  expect(getProductActions(product, 'sale').canEnquire).toBe(false);
});

test('stock and existing cart quantities limit purchase additions', () => {
  expect(getProductActions({ stock: 1 }, 'sale', 1)).toMatchObject({ remaining: 0, canAdd: false });
  expect(getProductActions({ stock: 3 }, 'sale', 1)).toMatchObject({ remaining: 2, canAdd: true });
  expect(getProductActions({ stock: 0 }, 'sale').canEnquire).toBe(false);
  expect(getProductActions({}, 'sale').limit).toBe(1);
  expect(getProductActions({ availabilityType: 'rent' }, 'sale').canEnquire).toBe(false);
});

test('rental messages communicate rental intent without a zero sale estimate', () => {
  const message = buildProductEnquiryMessage({ name: 'Mixer', rentalPrice: 500, rentPeriod: 'day', availabilityStatus: 'on_rent' }, 1, { name: 'Rahul' }, 'rent');
  expect(message).toContain('Enquiry: Rental');
  expect(message).toContain('₹500 / day');
  expect(message).toContain('future availability');
  expect(message).not.toContain('Estimated Price');
});
