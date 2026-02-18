import { CheckCircle, Users, Target, Award, Calendar } from "lucide-react";

export default function About() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-yellow-500 mb-4">
          About 3MT Machine Tools
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          With a legacy of over 35 years in sales and service, 3MT Machine Tools
          has been a trusted partner for builders, contractors, carpenters, and
          construction professionals across India.
        </p>
      </div>

      {/* Who We Are */}
      <section className="grid md:grid-cols-2 gap-10 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
          <p className="text-gray-700 leading-relaxed">
            At 3MT Machine Tools, we provide high-quality construction machines,
            tools, and equipment backed with unmatched customer support. Beyond
            just selling machines, we guide our customers to choose the right
            products and ensure proper usage for long-lasting performance and
            safety.
          </p>
        </div>
        <div>
          <img
            src="https://3mt.netlify.app/images/gallery/g1.jpg"
            alt="3MT Machine Tools"
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-10 mb-16">
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700">
            To deliver reliable, durable, and innovative construction machines
            with unmatched customer service, ensuring every project runs smoothly
            and efficiently.
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-gray-700">
            To be the most trusted name in construction tools and equipment across
            India, known for expertise, customer-first guidance, and lifelong
            service support.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Our Values</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-6 bg-yellow-50 rounded-lg shadow text-center">
            <Users className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold">Customer Commitment</h3>
            <p className="text-gray-600 text-sm">
              We treat every client as a long-term partner.
            </p>
          </div>
          <div className="p-6 bg-yellow-50 rounded-lg shadow text-center">
            <Award className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold">Service Excellence</h3>
            <p className="text-gray-600 text-sm">
              Beyond sales, we provide continuous after-sales support.
            </p>
          </div>
          <div className="p-6 bg-yellow-50 rounded-lg shadow text-center">
            <Target className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold">Innovation</h3>
            <p className="text-gray-600 text-sm">
              We keep upgrading our tools and solutions for modern needs.
            </p>
          </div>
          <div className="p-6 bg-yellow-50 rounded-lg shadow text-center">
            <CheckCircle className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold">Reliability</h3>
            <p className="text-gray-600 text-sm">
              Trusted by contractors, builders, and local professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Our Journey - Timeline */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Our Journey</h2>
        <div className="relative border-l-4 border-yellow-400 ml-6">
          {/* Timeline Item 1 */}
          <div className="mb-10 ml-6">
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-yellow-500 rounded-full">
              <Calendar className="w-4 h-4 text-white" />
            </span>
            <h3 className="text-lg font-semibold">1988 – The Beginning</h3>
            <p className="text-gray-600">
              3MT Machine Tools was founded with the vision to provide high-quality construction tools and professional service to the local community.
            </p>
          </div>

          {/* Timeline Item 2 */}
          <div className="mb-10 ml-6">
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-yellow-500 rounded-full">
              <Calendar className="w-4 h-4 text-white" />
            </span>
            <h3 className="text-lg font-semibold">2000s – Expansion</h3>
            <p className="text-gray-600">
              Expanded our services to include repairs, maintenance, spare parts,
              and emergency customer support, becoming a one-stop solution for
              contractors.
            </p>
          </div>

          {/* Timeline Item 3 */}
          <div className="ml-6">
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-yellow-500 rounded-full">
              <Calendar className="w-4 h-4 text-white" />
            </span>
            <h3 className="text-lg font-semibold">Today – A Trusted Partner</h3>
            <p className="text-gray-600">
              Today, with 35 years of experience, 3MT Machine Tools continues to
              guide thousands of customers with expert advice, reliable machines,
              and professional after-sales support.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Why Choose Us</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 rounded-lg shadow">
            <ul className="space-y-3 text-gray-700">
              <li>✅ 35+ years of legacy in sales & service</li>
              <li>✅ Wide range of construction tools & equipment</li>
              <li>✅ Genuine spare parts & emergency support</li>
              <li>✅ Trusted by contractors, carpenters, painters & builders</li>
            </ul>
          </div>
          <div>
            <img
              src="https://3mt.netlify.app/images/gallery/g2.jpg"
              alt="Our Work"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          Looking for Reliable Machines and Trusted Service?
        </h2>
        <a
          href="/contact"
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow hover:bg-yellow-600 transition font-semibold"
        >
          Contact Us Today
        </a>
      </section>
    </div>
  );
}
