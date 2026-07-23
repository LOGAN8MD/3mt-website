import { createEnquiry } from '../services/enquiryApi';
import { buildWhatsAppUrl } from './whatsapp';

export const openTrackedWhatsAppEnquiry = async ({ enquiry, message, onTrackingError }) => {
  const whatsappUrl = buildWhatsAppUrl(message);
  const whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

  if (whatsappWindow) {
    whatsappWindow.opener = null;
  }

  try {
    await createEnquiry({
      ...enquiry,
      message,
    });
  } catch (err) {
    if (onTrackingError) {
      onTrackingError(err);
    }
  }
};
