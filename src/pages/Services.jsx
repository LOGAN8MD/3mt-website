import { Wrench, ShoppingCart, LifeBuoy, Package, GraduationCap } from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "Machine Sales",
      icon: <ShoppingCart className="w-10 h-10 text-yellow-600 mb-3" />,
      description:
        "We provide top-quality construction machines such as drills, cutters, grinders, and breakers. Our experts guide you to select the right tool for your needs.",
    },
    {
      title: "Repair & Maintenance",
      icon: <Wrench className="w-10 h-10 text-yellow-600 mb-3" />,
      description:
        "Our skilled technicians ensure your machines run smoothly with reliable repairs, servicing, and preventive maintenance for long-lasting performance.",
    },
    {
      title: "Spare Parts & Accessories",
      icon: <Package className="w-10 h-10 text-yellow-600 mb-3" />,
      description:
        "We stock genuine spare parts and essential accessories, ensuring your tools stay durable and efficient while minimizing downtime.",
    },
    {
      title: "Emergency Support",
      icon: <LifeBuoy className="w-10 h-10 text-yellow-600 mb-3" />,
      description:
        "Construction can’t stop — and neither do we. Our quick-response emergency support helps you avoid costly project delays.",
    },
    {
      title: "Training & Guidance",
      icon: <GraduationCap className="w-10 h-10 text-yellow-600 mb-3" />,
      description:
        "We don’t just sell machines — we guide you in using them safely and effectively, providing recommendations tailored to your projects.",
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-yellow-500 mb-4">Our Services</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          At 3MT Machine Tools, we go beyond just selling machines. We provide a
          complete package of services to keep your projects running efficiently,
          safely, and without delays.
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
          Need machines, service, or quick support?
        </h2>
        <a
          href="/contact"
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow hover:bg-yellow-600 transition font-semibold"
        >
          Contact Us Now
        </a>
      </div>
    </div>
  );
}
