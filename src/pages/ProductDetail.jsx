import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { Minus, Plus, ShoppingCart, MessageCircle } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity }));
      // Optional: Add a toast notification here
    }
  };

  const handleEnquire = () => {
    if (!product) return;
    const message = `Hello 3MT, I would like to enquire about this product:\n\nProduct Name: ${product.name}\nQuantity: ${quantity}\nEstimated Price: ₹${product.price * quantity}\n`;
    const whatsappUrl = `https://wa.me/919322232809?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    window.scrollTo(0, 0);

    Promise.all([
      axiosInstance.get(`/api/products/${id}`),
      axiosInstance.get('/api/products')
    ])
      .then(([resProduct, resAll]) => {
        setProduct(resProduct.data);
        if (resProduct.data.images && resProduct.data.images.length > 0) {
          setSelectedImage(resProduct.data.images[0].url);
        } else {
          setSelectedImage(null);
        }
        setAllProducts(resAll.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch product details');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-10 text-center bg-gray-50">
        <h2 className="text-2xl text-red-500 font-bold mb-6">{error || 'Product not found'}</h2>
        <button onClick={() => navigate('/products')} className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition">
          Back to Products
        </button>
      </div>
    );
  }

  // --- Related Products Logic ---
  const getMachineCategories = (prod) => {
    if (!prod) return [];
    if (prod.type?.toLowerCase().trim() === 'machine') {
      return prod.category ? [prod.category.trim().toLowerCase()] : [];
    } else {
      return prod.subCategory ? prod.subCategory.split(',').map(s => s.trim().toLowerCase()) : [];
    }
  };

  const pCategories = getMachineCategories(product);

  const relatedProducts = allProducts.filter(r => {
    if (r._id === product._id) return false;
    const rCategories = getMachineCategories(r);
    // Intersection: check if any category matches
    return pCategories.some(c => rCategories.includes(c));
  });

  const relatedByType = {
    machine: [],
    accessory: [],
    part: [],
    tool: [],
    spare: []
  };

  relatedProducts.forEach(r => {
    const t = r.type?.toLowerCase().trim();
    if (relatedByType[t]) {
      relatedByType[t].push(r);
    }
  });

  const ProductCard = ({ prod }) => (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-gray-100 overflow-hidden h-full">
      {/* Image Container */}
      <div className="relative w-full h-40 sm:h-48 bg-gray-50/50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        {prod.images && prod.images.length > 0 ? (
          <img 
            src={prod.images[0].url} 
            alt={prod.name} 
            className="max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-1 sm:mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">No Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-1 sm:gap-2 mb-2 sm:mb-3">
          {prod.brand && (
            <span className="inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 bg-yellow-100 text-yellow-800 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest rounded-full">
              {prod.brand}
            </span>
          )}
          <span className="inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 text-gray-600 text-[9px] sm:text-[10px] font-semibold rounded uppercase line-clamp-1 text-right">
            {prod.category || prod.type || 'Tool'}
          </span>
        </div>
        
        <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-yellow-600 transition-colors">
          {prod.name}
        </h3>
        
        <div className="mt-auto pt-3 sm:pt-4 flex justify-between items-end border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Price</span>
            <span className="text-base sm:text-xl font-extrabold text-gray-900 tracking-tight">₹{prod.price}</span>
          </div>
          
          <Link 
            to={`/product/${prod._id}`} 
            className="flex items-center justify-center bg-gray-900 hover:bg-yellow-500 text-white hover:text-gray-900 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            title="View Details"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Main Product Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 lg:p-12 border border-gray-100 mb-16">
          <button 
            onClick={() => navigate(-1)}
            className="mb-8 text-gray-500 hover:text-gray-900 font-bold uppercase tracking-wider text-sm flex items-center gap-2 transition"
          >
            &larr; Back to Products
          </button>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            
            {/* Left Column: Image Gallery */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <div 
                className="relative w-full aspect-square bg-gray-50 rounded-2xl border border-gray-100 p-8 flex items-center justify-center cursor-zoom-in group hover:shadow-lg transition-all duration-300"
                onClick={() => product.images?.length > 0 && setIsFullScreen(true)}
                title="Click to view full screen"
              >
                {selectedImage ? (
                  <img 
                    src={selectedImage} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="py-20 text-gray-400 font-medium">No image available</div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-4 mt-6 overflow-x-auto pb-2 custom-scrollbar">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img.url)}
                      className={`flex-shrink-0 w-20 h-20 bg-white rounded-xl border-2 p-2 overflow-hidden transition-all ${
                        selectedImage === img.url ? 'border-yellow-500 shadow-md scale-105' : 'border-gray-100 hover:border-yellow-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Details */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.brand && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-[11px] sm:text-xs font-black uppercase tracking-widest rounded-full">
                    {product.brand}
                  </span>
                )}
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[11px] sm:text-xs font-black uppercase tracking-widest rounded-full">
                  {product.category || product.type || 'Tool'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                {product.name}
              </h1>

              {/* Size/Capacity */}
              {product.size && product.size.trim() !== '' && (
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Size/Capacity:</span>
                  <span className="font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded">{product.size}</span>
                </div>
              )}
              
              {/* Price */}
              <div className="mb-8 flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter">₹{product.price}</span>
                <span className="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest">Excl. Tax</span>
              </div>

              {/* Description */}
              {product.description && product.description.trim() !== '' && (
                <div className="prose prose-sm sm:prose-base text-gray-600 mb-10 leading-relaxed whitespace-pre-wrap">
                  <p>{product.description}</p>
                </div>
              )}

              {/* Divider */}
              <hr className="border-gray-100 mb-8" />

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between border-2 border-gray-200 rounded-xl bg-white sm:w-1/3">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-4 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-l-xl disabled:opacity-30"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-2 text-xl font-black text-gray-900 w-12 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-4 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-r-xl"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-gray-900 hover:bg-yellow-500 text-white hover:text-gray-900 text-lg font-black py-4 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-3 group"
                  >
                    <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Add to Cart
                  </button>
                </div>

                {/* WhatsApp Enquire Button */}
                <button 
                  onClick={handleEnquire}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-lg font-black py-4 rounded-xl shadow-md hover:shadow-xl hover:shadow-[#25D366]/30 hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-3 group"
                >
                  <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  Enquire via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Related Products Section --- */}
        <div className="mt-16 space-y-12">
          {['machine', 'accessory', 'part', 'tool', 'spare'].map(type => {
            const items = relatedByType[type];
            // Only render the section if there are related items
            if (!items || items.length === 0) return null;
            
            // Group items by category
            const groupedByCategory = items.reduce((acc, item) => {
              const cat = item.category ? item.category.trim() : 'Other';
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(item);
              return acc;
            }, {});

            return (
              <div key={type} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-2 h-8 bg-yellow-400 rounded-full"></span>
                  <h2 className="text-3xl font-bold text-gray-900 capitalize">
                    Related {type === 'accessory' ? 'Accessories' : type + 's'}
                  </h2>
                </div>
                
                <div className="space-y-10">
                  {Object.entries(groupedByCategory).map(([categoryName, catItems]) => (
                    <div key={categoryName}>
                      <h3 className="text-lg font-bold text-gray-700 capitalize mb-4 pb-2 border-b border-gray-100">
                        {categoryName}
                      </h3>
                      <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 custom-scrollbar snap-x snap-mandatory px-1">
                        {catItems.map(item => (
                          <div key={item._id} className="w-[180px] min-w-[180px] sm:w-[280px] sm:min-w-[280px] lg:w-[320px] lg:min-w-[320px] flex-shrink-0 snap-start">
                            <ProductCard prod={item} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-10">
          <button 
            onClick={() => setIsFullScreen(false)}
            className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition z-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <img 
            src={selectedImage} 
            alt={product.name} 
            className="max-w-full max-h-[75vh] object-contain mb-8"
          />
          
          {product.images && product.images.length > 1 && (
            <div className="flex justify-center gap-4 overflow-x-auto max-w-full px-4 pb-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(img.url);
                  }}
                  className={`flex-shrink-0 w-20 h-20 bg-white rounded-lg border-2 p-1 transition-all ${
                    selectedImage === img.url ? 'border-yellow-500 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default ProductDetail;
