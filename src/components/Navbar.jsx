import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // for hamburger menu icons

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Brand */}
          <div className="flex flex-col leading-tight">
            <h1 className="text-2xl font-bold text-yellow-400">3MT</h1>
            <span className="text-sm text-gray-300">Machine Tools</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-yellow-400">Home</Link>
            <Link to="/about" className="hover:text-yellow-400">About</Link>
            <Link to="/products" className="hover:text-yellow-400">Products</Link>
            <Link to="/services" className="hover:text-yellow-400">Services</Link>
            <Link to="/industries" className="hover:text-yellow-400">Industries</Link>
            <Link to="/gallery" className="hover:text-yellow-400">Gallery</Link>
            <Link to="/contact" className="hover:text-yellow-400">Contact</Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 hover:text-yellow-400 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 pb-4 space-y-2">
          <Link to="/" className="block py-2 hover:text-yellow-400">Home</Link>
          <Link to="/about" className="block py-2 hover:text-yellow-400">About</Link>
          <Link to="/products" className="block py-2 hover:text-yellow-400">Products</Link>
          <Link to="/services" className="block py-2 hover:text-yellow-400">Services</Link>
          <Link to="/industries" className="block py-2 hover:text-yellow-400">Industries</Link>
          <Link to="/gallery" className="block py-2 hover:text-yellow-400">Gallery</Link>
          <Link to="/contact" className="block py-2 hover:text-yellow-400">Contact</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

