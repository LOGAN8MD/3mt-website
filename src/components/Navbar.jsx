import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, ShoppingCart } from "lucide-react"; 
import axiosInstance from "../utils/axiosInstance";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const cartItems = useSelector(state => state.cart.cartItems);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products for search autocomplete
    axiosInstance.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Failed to fetch products for search", err));
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectProduct = (id) => {
    setSearchQuery("");
    setShowDropdown(false);
    setIsOpen(false);
    navigate(`/product/${id}`);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Brand */}
          <Link to="/" className="flex flex-col leading-tight shrink-0">
            <h1 className="text-2xl font-bold text-yellow-400">3MT</h1>
            <span className="text-sm text-gray-300 hidden sm:block">Machine Tools</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 mx-4 md:mx-8 max-w-xl relative">
            <div className="relative">
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-colors"
                placeholder="Search tools, parts, accessories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
              <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            {/* Search Dropdown */}
            {showDropdown && searchQuery.trim() !== "" && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden z-50">
                {filteredProducts.length > 0 ? (
                  <ul className="max-h-72 overflow-y-auto">
                    {filteredProducts.map(p => (
                      <li 
                        key={p._id}
                        className="px-4 py-3 hover:bg-yellow-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center gap-3 transition-colors"
                        onClick={() => handleSelectProduct(p._id)}
                      >
                        {p.images && p.images.length > 0 ? (
                          <img src={p.images[0].url} alt={p.name} className="w-10 h-10 object-contain rounded bg-gray-50 p-1 mix-blend-multiply" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded"></div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-gray-800 font-medium text-sm line-clamp-1">{p.name}</span>
                          <span className="text-xs text-gray-500">{p.category || p.type}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    <p className="text-sm">No products found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 shrink-0">
            <Link to="/" className="text-sm font-medium hover:text-yellow-400 transition-colors">Home</Link>
            <Link to="/about" className="text-sm font-medium hover:text-yellow-400 transition-colors">About</Link>
            <Link to="/products" className="text-sm font-medium hover:text-yellow-400 transition-colors">Products</Link>
            <Link to="/services" className="text-sm font-medium hover:text-yellow-400 transition-colors">Services</Link>
            <Link to="/gallery" className="text-sm font-medium hover:text-yellow-400 transition-colors">Gallery</Link>
            <Link to="/contact" className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors">Contact</Link>
            <Link to="/cart" className="relative p-2 text-gray-200 hover:text-yellow-400 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Hamburger and Cart */}
          <div className="lg:hidden flex items-center gap-4 shrink-0">
            <Link to="/cart" className="relative p-2 text-gray-200 hover:text-yellow-400 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 hover:text-yellow-400 focus:outline-none p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden bg-gray-800 px-4 pb-6 space-y-3 pt-2 shadow-inner border-t border-gray-700">
          <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-700 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/about" className="block px-3 py-2 rounded-md hover:bg-gray-700 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/products" className="block px-3 py-2 rounded-md hover:bg-gray-700 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>Products</Link>
          <Link to="/services" className="block px-3 py-2 rounded-md hover:bg-gray-700 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>Services</Link>
          <Link to="/gallery" className="block px-3 py-2 rounded-md hover:bg-gray-700 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>Gallery</Link>
          <Link to="/contact" className="block px-3 py-2 mt-4 bg-yellow-500 text-gray-900 font-bold text-center rounded-lg hover:bg-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>Contact Us</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
