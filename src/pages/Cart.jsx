import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, removeFromCart, updateQuantity } from '../redux/cartSlice';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, MessageCircle } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { buildCartEnquiryMessage } from '../utils/whatsapp';
import { getOptimizedImageUrl } from '../utils/cloudinaryImage';
import { useAuth } from '../context/AuthContext';
import { openTrackedWhatsAppEnquiry } from '../utils/trackedWhatsAppEnquiry';

function Cart() {
  const cartItems = useSelector(state => state.cart.cartItems);
  const dispatch = useDispatch();
  const { requireAuth } = useAuth();
  const [enquiryNotice, setEnquiryNotice] = React.useState('');
  const [enquiryNoticeType, setEnquiryNoticeType] = React.useState('success');

  const handleQuantityChange = (id, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const handleWhatsAppEnquiry = () => {
    if (cartItems.length === 0) return;

    setEnquiryNotice('');
    setEnquiryNoticeType('success');

    requireAuth((authUser) => {
      const message = buildCartEnquiryMessage(cartItems, authUser);

      return (
      openTrackedWhatsAppEnquiry({
        message,
        enquiry: {
          source: 'cart',
          products: cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
        },
        onOpened: () => {
          dispatch(clearCart());
          setEnquiryNoticeType('success');
          setEnquiryNotice('WhatsApp enquiry opened successfully. Your cart has been cleared.');
        },
        onTrackingError: () => {
          setEnquiryNoticeType('warning');
          setEnquiryNotice('WhatsApp opened and your cart was cleared, but the enquiry could not be saved right now.');
        },
      })
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <h2 className="text-xl text-gray-500 mb-6">Your cart is currently empty.</h2>
            {enquiryNotice && (
              <p className={`mb-6 rounded-lg px-4 py-3 text-sm font-semibold ${
                enquiryNoticeType === 'warning'
                  ? 'bg-yellow-50 text-yellow-800'
                  : 'bg-green-50 text-green-800'
              }`}>
                {enquiryNotice}
              </p>
            )}
            <Link to="/products" className="inline-block px-6 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <li key={item._id} className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={getOptimizedImageUrl(item.images[0].url, { width: 160 })}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                            className="max-h-full object-contain mix-blend-multiply"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">No Image</span>
                        )}
                      </div>
                      
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{item.name}</h3>
                          <p className="text-lg font-bold text-gray-900 ml-4 whitespace-nowrap">{formatCurrency(item.price)}</p>
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-1">{item.brand || item.category}</p>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button 
                              onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors rounded-l-lg disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-1 text-gray-900 font-medium min-w-[3rem] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors rounded-r-lg"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => handleRemove(item._id)}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="flex justify-between text-gray-600 mb-4 text-sm">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium text-gray-900">{formatCurrency(cartTotal)}</span>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-extrabold text-yellow-600">{formatCurrency(cartTotal)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Taxes and shipping calculated at checkout</p>
                </div>

                <button 
                  onClick={handleWhatsAppEnquiry}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#25D366]/30"
                >
                  <MessageCircle className="w-5 h-5" />
                  Enquire via WhatsApp
                </button>
                {enquiryNotice && (
                  <p className={`mt-3 rounded-lg px-3 py-2 text-sm font-medium ${
                    enquiryNoticeType === 'warning'
                      ? 'bg-yellow-50 text-yellow-800'
                      : 'bg-green-50 text-green-800'
                  }`}>
                    {enquiryNotice}
                  </p>
                )}
                
                <div className="mt-4 text-center">
                  <Link to="/products" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    or Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
