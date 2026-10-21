import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useEnquiryConfirmation } from './EnquiryConfirmation';
import { validateEnquiry } from '../services/enquiryApi';
import { openTrackedWhatsAppEnquiry } from '../utils/trackedWhatsAppEnquiry';
import cartReducer, { consumeEnquiredItems } from '../redux/cartSlice';

jest.mock('../services/enquiryApi', () => ({ validateEnquiry: jest.fn() }));
jest.mock('../utils/trackedWhatsAppEnquiry', () => ({ openTrackedWhatsAppEnquiry: jest.fn() }));
const onError = jest.fn();
function Harness() {
  const { prepare, confirmation, busy } = useEnquiryConfirmation();
  return <>{confirmation}<button disabled={busy} onClick={() => prepare({ enquiry: { source: 'cart', products: [{ productId: '1', quantity: 1, intent: 'sale' }] }, customer: { name: 'Rahul' }, onValidationError: onError })}>Enquire</button></>;
}
beforeEach(() => jest.clearAllMocks());
test('fresh checked prices appear before opening WhatsApp and cancellation does not send', async () => {
  validateEnquiry.mockResolvedValue({ products: [{ product: '1', nameSnapshot: 'Mixer', quantity: 1, priceSnapshot: 250, conditionSnapshot: 'used', intent: 'sale' }] });
  render(<Harness />);
  fireEvent.click(screen.getByText('Enquire'));
  await screen.findByRole('dialog');
  expect(screen.getByText(/₹250/)).toBeInTheDocument();
  expect(openTrackedWhatsAppEnquiry).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText('Cancel'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  fireEvent.click(screen.getByText('Enquire'));
  fireEvent.click(await screen.findByText('Open WhatsApp'));
  await waitFor(() => expect(openTrackedWhatsAppEnquiry).toHaveBeenCalledTimes(1));
});
test('failed live validation never opens WhatsApp', async () => {
  validateEnquiry.mockRejectedValue(new Error('Mixer: sold'));
  render(<Harness />);
  fireEvent.click(screen.getByText('Enquire'));
  await waitFor(() => expect(onError).toHaveBeenCalled());
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(openTrackedWhatsAppEnquiry).not.toHaveBeenCalled();
});
test('successful enquiry cleanup preserves later additions', () => {
  const state = { cartItems: [{ _id: '1', quantity: 3 }, { _id: '2', quantity: 1 }] };
  expect(cartReducer(state, consumeEnquiredItems([{ _id: '1', quantity: 2 }])).cartItems).toEqual([{ _id: '1', quantity: 1 }, { _id: '2', quantity: 1 }]);
});
