import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, Settings } from "lucide-react"; 
import { useTranslation } from "react-i18next";
import { searchProducts } from "../services/productApi";
import { getOptimizedImageUrl } from "../utils/cloudinaryImage";

const SEARCH_DEBOUNCE_MS = 300;
const MIN_SEARCH_LENGTH = 2;

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const { t, i18n } = useTranslation();
  
  const cartItems = useSelector(state => state.cart.cartItems);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navigate = useNavigate();

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery.length < MIN_SEARCH_LENGTH) {
      setProducts([]);
      setIsSearching(false);
      return undefined;
    }

    const controller = new AbortController();
    setProducts([]);
    setIsSearching(true);

    const timeoutId = window.setTimeout(() => {
      searchProducts(trimmedQuery, { limit: 8 }, { signal: controller.signal })
        .then(setProducts)
        .catch(err => {
          if (err.code !== 'ERR_CANCELED') {
            setProducts([]);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsSearching(false);
          }
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchQuery]);

  const handleSelectProduct = (id) => {
    setSearchQuery("");
    setShowDropdown(false);
    setIsOpen(false);
    navigate(`/product/${id}`);
  };

  const handleLanguageChange = (lang) => {
    localStorage.setItem('language', lang);
    i18n.changeLanguage(lang);
    setShowSettings(false);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Brand */}
          <Link to="/" className="flex flex-col leading-tight shrink-0">
            <h1 className="text-2xl font-bold text-yellow-400">3MT</h1>
            <span className="text-sm text-gray-300 hidden sm:block">{t('navbar.machine_tools')}</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 mx-4 md:mx-8 max-w-xl relative">
            <div className="relative">
              <input 
                type="text" 
                aria-label={t('navbar.search_placeholder')}
                className="w-full pl-10 pr-4 py-2 text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-colors"
                placeholder={t('navbar.search_placeholder')}
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
            {showDropdown && searchQuery.trim().length >= MIN_SEARCH_LENGTH && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden z-50">
                {isSearching ? (
                  <div className="px-4 py-6 text-center text-gray-500" role="status">
                    <p className="text-sm">Searching products...</p>
                  </div>
                ) : products.length > 0 ? (
                  <ul className="max-h-72 overflow-y-auto">
                    {products.map(p => (
                      <li 
                        key={p._id}
                        className="px-4 py-3 hover:bg-yellow-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center gap-3 transition-colors"
                        onClick={() => handleSelectProduct(p._id)}
                      >
                        {p.images && p.images.length > 0 ? (
                          <img
                            src={getOptimizedImageUrl(p.images[0].url, { width: 96 })}
                            alt={p.name}
                            loading="lazy"
                            decoding="async"
                            className="w-10 h-10 object-contain rounded bg-gray-50 p-1 mix-blend-multiply"
                          />
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
                    <p className="text-sm">{t('navbar.no_products')} "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 shrink-0 relative">
            <Link to="/" className="text-sm font-medium hover:text-yellow-400 transition-colors">{t('navbar.home')}</Link>
            <Link to="/about" className="text-sm font-medium hover:text-yellow-400 transition-colors">{t('navbar.about')}</Link>
            <Link to="/products" className="text-sm font-medium hover:text-yellow-400 transition-colors">{t('navbar.products')}</Link>
            <Link to="/services" className="text-sm font-medium hover:text-yellow-400 transition-colors">{t('navbar.services')}</Link>
            {/* <Link to="/gallery" className="text-sm font-medium hover:text-yellow-400 transition-colors">{t('navbar.gallery')}</Link> */}
            <Link to="/contact" className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors">{t('navbar.contact')}</Link>
            
            <Link to="/cart" className="relative p-2 text-gray-200 hover:text-yellow-400 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button 
                type="button"
                aria-label="Language settings"
                aria-expanded={showSettings}
                onClick={() => setShowSettings(!showSettings)} 
                className="p-2 text-gray-200 hover:text-yellow-400 transition-colors focus:outline-none"
              >
                <Settings className={`w-6 h-6 transition-transform ${showSettings ? 'rotate-90' : ''}`} />
              </button>
              
              {showSettings && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Language / भाषा
                  </div>
                  <button 
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${i18n.language === 'en' ? 'bg-yellow-50 text-yellow-700 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => handleLanguageChange('hi')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors border-t border-gray-50 ${i18n.language === 'hi' ? 'bg-yellow-50 text-yellow-700 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    हिन्दी (Hindi)
                  </button>
                </div>
              )}
            </div>
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
              type="button"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
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
          <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-700 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>{t('navbar.home')}</Link>
          <Link to="/about" className="block px-3 py-2 rounded-md hover:bg-gray-700 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>{t('navbar.about')}</Link>
          <Link to="/products" className="block px-3 py-2 rounded-md hover:bg-gray-700 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>{t('navbar.products')}</Link>
          <Link to="/services" className="block px-3 py-2 rounded-md hover:bg-gray-700 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>{t('navbar.services')}</Link>
          <Link to="/contact" className="block px-3 py-2 mt-4 bg-yellow-500 text-gray-900 font-bold text-center rounded-lg hover:bg-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>{t('navbar.contact')}</Link>
          
          <div className="pt-4 mt-4 border-t border-gray-700">
            <p className="px-3 text-xs text-gray-400 uppercase tracking-wider mb-2">Language / भाषा</p>
            <div className="flex gap-2 px-3">
              <button 
                onClick={() => handleLanguageChange('en')}
                className={`flex-1 py-2 text-sm rounded-md transition-colors ${i18n.language === 'en' ? 'bg-yellow-500 text-gray-900 font-bold' : 'bg-gray-700 text-white'}`}
              >
                English
              </button>
              <button 
                onClick={() => handleLanguageChange('hi')}
                className={`flex-1 py-2 text-sm rounded-md transition-colors ${i18n.language === 'hi' ? 'bg-yellow-500 text-gray-900 font-bold' : 'bg-gray-700 text-white'}`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
