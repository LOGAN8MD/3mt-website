import { useRef, useState } from 'react';
import { validateEnquiry } from '../services/enquiryApi';
import { buildCartEnquiryMessage, buildProductEnquiryMessage } from '../utils/whatsapp';
import { openTrackedWhatsAppEnquiry } from '../utils/trackedWhatsAppEnquiry';

export function useEnquiryConfirmation() {
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);

  const prepare = async ({ enquiry, customer, onTracked, onTrackingError, onValidationError }) => {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      const result = await validateEnquiry(enquiry);
      const products = result.products.map((item) => ({
        _id: item.product, name: item.nameSnapshot, condition: item.conditionSnapshot,
        price: item.priceSnapshot, quantity: item.quantity, intent: item.intent,
        rentalPrice: item.rentalPriceSnapshot, rentPeriod: item.rentPeriodSnapshot,
        securityDeposit: item.securityDepositSnapshot, availabilityStatus: item.availabilityStatusSnapshot,
      }));
      const message = enquiry.source === 'cart'
        ? buildCartEnquiryMessage(products, customer)
        : buildProductEnquiryMessage(products[0], products[0].quantity, customer, products[0].intent);
      setPending({ enquiry, message, onTracked, onTrackingError });
    } catch (error) {
      onValidationError(error);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };

  const confirm = async () => {
    if (!pending || lock.current) return;
    lock.current = true;
    setBusy(true);
    const selected = pending;
    setPending(null);
    try { await openTrackedWhatsAppEnquiry(selected); }
    finally { lock.current = false; setBusy(false); }
  };

  const confirmation = pending ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <section role="dialog" aria-modal="true" aria-labelledby="enquiry-confirm-title" className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl">
        <h2 id="enquiry-confirm-title" className="mb-3 text-xl font-bold text-gray-900">Confirm enquiry</h2>
        <pre className="max-h-[50vh] overflow-y-auto whitespace-pre-wrap break-words font-sans text-sm text-gray-700">{pending.message}</pre>
        <p className="mt-3 text-sm text-gray-600">Availability is subject to confirmation. This is not a booking.</p>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button autoFocus type="button" onClick={() => setPending(null)} className="rounded border px-4 py-2 text-gray-900">Cancel</button>
          <button type="button" onClick={confirm} className="rounded bg-green-700 px-4 py-2 font-semibold text-white">Open WhatsApp</button>
        </div>
      </section>
    </div>
  ) : null;
  return { prepare, confirmation, busy };
}
