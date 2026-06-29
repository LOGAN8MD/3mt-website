import { formatCurrency } from './utils/currency';
import { getOptimizedImageUrl } from './utils/cloudinaryImage';
import {
  BUSINESS_CONTACT,
  buildProductEnquiryMessage,
  buildWhatsAppUrl,
} from './utils/whatsapp';

test('formats Indian rupee values', () => {
  expect(formatCurrency(125000)).toBe('₹1,25,000');
});

test('builds an encoded product enquiry URL with the configured number', () => {
  const message = buildProductEnquiryMessage(
    { name: 'Angle Grinder', price: 7500 },
    2
  );
  const url = buildWhatsAppUrl(message);

  expect(url).toContain(`https://wa.me/${BUSINESS_CONTACT.whatsapp}?text=`);
  expect(decodeURIComponent(url.split('?text=')[1])).toContain(
    'Estimated Price: ₹15,000'
  );
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
