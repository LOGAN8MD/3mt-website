import { formatCurrency } from './utils/currency';
import { getOptimizedImageUrl } from './utils/cloudinaryImage';
import {
  BUSINESS_CONTACT,
  buildProductEnquiryMessage,
  buildWhatsAppUrl,
} from './utils/whatsapp';
import {
  markApiRequestDelayed,
  resetApiDelayForTests,
  subscribeToApiDelay,
} from './utils/apiDelayNotifier';
import { openTrackedWhatsAppEnquiry } from './utils/trackedWhatsAppEnquiry';
import { createEnquiry } from './services/enquiryApi';

jest.mock('./services/enquiryApi', () => ({
  createEnquiry: jest.fn(),
}));

test('formats Indian rupee values', () => {
  expect(formatCurrency(125000)).toBe('₹1,25,000');
});

test('builds an encoded product enquiry URL with the configured number', () => {
  const message = buildProductEnquiryMessage(
    { name: 'Angle Grinder', price: 7500 },
    2,
    {
      name: 'Rahul Mishra',
      email: 'rahul@example.com',
      phone: '9876543210',
      address: '',
    }
  );
  const url = buildWhatsAppUrl(message);
  const decodedMessage = decodeURIComponent(url.split('?text=')[1]);

  expect(url).toContain(`https://wa.me/${BUSINESS_CONTACT.whatsapp}?text=`);
  expect(decodedMessage).toContain('Hello 3MT, I am Rahul Mishra.');
  expect(decodedMessage).toContain('Product Details:');
  expect(decodedMessage).toContain('Estimated Price: ₹15,000');
  expect(decodedMessage).toContain('My Details:');
  expect(decodedMessage).toContain('Email: rahul@example.com');
  expect(decodedMessage).toContain('Phone: 9876543210');
  expect(decodedMessage).not.toContain('Name: Rahul Mishra');
  expect(decodedMessage).not.toContain('Address:');
});

test('adds Cloudinary image transformations safely', () => {
  const url = 'https://res.cloudinary.com/demo/image/upload/v123/products/drill.jpg';

  expect(getOptimizedImageUrl(url, { width: 480 })).toBe(
    'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_480/v123/products/drill.jpg'
  );
});

test('keeps non-Cloudinary image URLs unchanged', () => {
  const url = 'https://example.com/products/drill.jpg';

  expect(getOptimizedImageUrl(url, { width: 480 })).toBe(url);
});

test('notifies when a backend request becomes delayed and clears after completion', () => {
  const states = [];
  const unsubscribe = subscribeToApiDelay((isDelayed) => {
    states.push(isDelayed);
  });

  const clearDelay = markApiRequestDelayed();
  clearDelay();
  unsubscribe();
  resetApiDelayForTests();

  expect(states).toEqual([false, true, false]);
});

test('opens tracked WhatsApp enquiries directly without an empty tab first', async () => {
  createEnquiry.mockResolvedValue({});
  const openedWindow = { opener: {} };
  const openSpy = jest.spyOn(window, 'open').mockReturnValue(openedWindow);

  const result = await openTrackedWhatsAppEnquiry({
    message: 'Hello 3MT',
    enquiry: {
      source: 'product_detail',
      products: [{ productId: '507f1f77bcf86cd799439011', quantity: 1 }],
    },
  });

  expect(result.opened).toBe(true);
  expect(openSpy).toHaveBeenCalledTimes(1);
  expect(openSpy.mock.calls[0][0]).toContain(`https://wa.me/${BUSINESS_CONTACT.whatsapp}?text=`);
  expect(openSpy.mock.calls[0][0]).not.toBe('');
  expect(createEnquiry).toHaveBeenCalledWith({
    source: 'product_detail',
    products: [{ productId: '507f1f77bcf86cd799439011', quantity: 1 }],
    message: 'Hello 3MT',
  });
  expect(openedWindow.opener).toBeNull();

  openSpy.mockRestore();
});
