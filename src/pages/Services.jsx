import { Wrench, ShoppingCart, LifeBuoy, Package, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Services() {
  const { t } = useTranslation();
  const services = [
    {
      title: t('services.sales'),
      icon: <ShoppingCart className="w-10 h-10 text-yellow-600 mb-3" />,
      description: t('services.sales_desc'),
    },
    {
      title: t('services.repair'),
      icon: <Wrench className="w-10 h-10 text-yellow-600 mb-3" />,
      description: t('services.repair_desc'),
    },
    {
      title: t('services.spare_parts'),
      icon: <Package className="w-10 h-10 text-yellow-600 mb-3" />,
      description: t('services.spare_parts_desc'),
    },
    {
      title: t('services.emergency'),
      icon: <LifeBuoy className="w-10 h-10 text-yellow-600 mb-3" />,
      description: t('services.emergency_desc'),
    },
    {
      title: t('services.training'),
      icon: <GraduationCap className="w-10 h-10 text-yellow-600 mb-3" />,
      description: t('services.training_desc'),
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-yellow-500 mb-4">{t('services.title')}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {t('services.subtitle')}
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-xl shadow hover:shadow-lg hover:scale-105 transition text-center"
          >
            <div className="flex justify-center">{service.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
            <p className="text-gray-600 text-sm">{service.description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <h2 className="text-2xl font-bold mb-4">
          {t('services.cta_title')}
        </h2>
        <a
          href="/contact"
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow hover:bg-yellow-600 transition font-semibold"
        >
          {t('services.cta_btn')}
        </a>
      </div>
    </div>
  );
}
