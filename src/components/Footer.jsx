function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-6 mt-10">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 text-sm">
        {/* Company Info */}
        <div>
          <h3 className="font-semibold text-lg mb-2">3MT Machine Tools</h3>
          <p>Quality Construction Machines with Sales & Service Support.</p>
        </div>

        {/* Quick Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Contact</h3>
          <p>📍  3MT Machine Tools, Shop.11, Shreeji Shopping Arcade, Mahatma Gandhi Rd, Borivali East, Mumbai, Maharashtra 400066, India</p>
          <p>📞 <a href="tel:+919322232809" className="hover:underline">+91 9322232809</a></p>
          <p>✉️ <a href="mailto:info@3mt.com" className="hover:underline">3mt1988@gmail.com</a></p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Quick Links</h3>
          <p><a href="/" className="hover:underline">Home</a></p>
          <p><a href="/products" className="hover:underline">Products</a></p>
          <p><a href="/services" className="hover:underline">Services</a></p>
          <p><a href="/contact" className="hover:underline">Contact</a></p>
        </div>
      </div>

      <p className="mt-6 text-gray-400 text-xs">
        © {new Date().getFullYear()} 3MT Machine Tools. All Rights Reserved.
      </p>
    </footer>
  );
}
export default Footer;