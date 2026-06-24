import { useState } from "react";
import { Phone, MessageCircle, MapPin, Mail, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  BUSINESS_CONTACT,
  buildGeneralEnquiryMessage,
  buildWhatsAppUrl,
  getTelephoneUrl,
} from "../utils/whatsapp";

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const alertMsg = t('contact.alert_msg', { name: formData.name || t('contact.alert_msg_fallback') });
    alert(alertMsg);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-yellow-400 mb-6">{t('contact.title')}</h2>

      {/* Contact Info Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-4 bg-gray-50 p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-3">{t('contact.get_in_touch')}</h3>

          {/* Address */}
          <p className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-red-500 mt-1" />
            <span>
              {t('contact.address')}
            </span>
          </p>

          {/* Phone */}
          <p className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-600" />
            <a
              href={getTelephoneUrl()}
              className="text-blue-600 font-medium hover:underline"
            >
              {BUSINESS_CONTACT.displayPhone}
            </a>
          </p>

          {/* Email */}
          <p className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-yellow-600" />
            <a
              href="mailto:3mt1988@gmail.com"
              className="text-blue-600 font-medium hover:underline"
            >
              3mt1988@gmail.com
            </a>
          </p>

          {/* Business Hours */}
          <p className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            Mon – Sat, 9:00 AM – 9:00 PM
          </p>

          {/* Call & WhatsApp Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <a
              href={getTelephoneUrl()}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-green-700 transition font-semibold"
            >
              <Phone className="w-5 h-5" /> {t('contact.call_us')}
            </a>
            <a
              href={buildWhatsAppUrl(buildGeneralEnquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-lg shadow-md hover:bg-green-500 transition font-semibold"
            >
              <MessageCircle className="w-5 h-5" /> {t('contact.whatsapp_us')}
            </a>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="rounded-lg overflow-hidden shadow">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3757.354447926843!2d72.85646251075389!3d19.23164938193022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b0cce367945d%3A0xa8b02556ec82159c!2s3MT%20Machine%20Tools!5e1!3m2!1sen!2sin!4v1755624807993!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="3MT Location"
          ></iframe>
        </div>
      </div>

      {/* Contact Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        <input
          type="text"
          name="name"
          placeholder={t('contact.form_name')}
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder={t('contact.form_email')}
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="message"
          placeholder={t('contact.form_message')}
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded h-32"
        />
        <button
          type="submit"
          className="bg-yellow-400 text-black px-4 py-2 rounded font-bold hover:bg-yellow-500"
        >
          {t('contact.form_send')}
        </button>
      </form>
    </div>
  );
}
