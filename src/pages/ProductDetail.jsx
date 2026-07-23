import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { Minus, Plus, ShoppingCart, MessageCircle, X } from 'lucide-react';
import { getProductById, getRelatedProducts } from '../services/productApi';
import ProductCard from '../components/ProductCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import { buildProductEnquiryMessage } from '../utils/whatsapp';
import { getOptimizedImageUrl } from '../utils/cloudinaryImage';
import { openTrackedWhatsAppEnquiry } from '../utils/trackedWhatsAppEnquiry';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [enquiryNotice, setEnquiryNotice] = useState('');
  const dispatch = useDispatch();
  const { requireAuth } = useAuth();

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity }));
    }
  };

  const handleEnquire = () => {
    if (!product) return;
    const message = buildProductEnquiryMessage(product, quantity);

    requireAuth(() =>
      openTrackedWhatsAppEnquiry({
        message,
        enquiry: {
          source: 'product_detail',
          products: [
            {
              productId: product._id,
              quantity,
            },
          ],
        },
        onTrackingError: () => {
          setEnquiryNotice('WhatsApp is opening, but the enquiry could not be saved right now.');
        },
      })
    );
  };

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);
    setProduct(null);
    setRelatedProducts([]);
    setQuantity(1);
    setIsFullScreen(false);
    window.scrollTo(0, 0);

    Promise.all([
      getProductById(id, { signal: controller.signal }),
      getRelatedProducts(id, { limit: 30 }, { signal: controller.signal })
    ])
      .then(([productData, relatedProductData]) => {
        setProduct(productData);
        setSelectedImage(productData.images?.[0]?.url || null);
        setRelatedProducts(relatedProductData);
        setLoading(false);
      })
      .catch(err => {
        if (err.code !== 'ERR_CANCELED') {
          setError(err.message || 'Failed to fetch product details');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return <LoadingState fullScreen label="Loading product details" />;
  }

  if (error || !product) {
    return (
      <ErrorState
        fullScreen
        message={error || 'Product not found'}
        actionLabel="Back to Products"
        onAction={() => navigate('/products')}
      />
    );
  }

  const relatedByType = {
    machine: [],
    accessory: [],
    part: [],
    tool: [],
    spare: []
  };

  const selectedImageLarge = getOptimizedImageUrl(selectedImage, { width: 900 });

  relatedProducts.forEach(r => {
    const t = r.type?.toLowerCase().trim();
    if (relatedByType[t]) {
      relatedByType[t].push(r);
    }
  });

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
                    src={selectedImageLarge} 
                    alt={product.name} 
                    loading="eager"
                    decoding="async"
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
                      key={img.public_id || img.url || idx}
                      type="button"
                      aria-label={`View ${product.name} image ${idx + 1}`}
                      aria-pressed={selectedImage === img.url}
                      onClick={() => setSelectedImage(img.url)}
                      className={`flex-shrink-0 w-20 h-20 bg-white rounded-xl border-2 p-2 overflow-hidden transition-all ${
                        selectedImage === img.url ? 'border-yellow-500 shadow-md scale-105' : 'border-gray-100 hover:border-yellow-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={getOptimizedImageUrl(img.url, { width: 160 })}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
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
                <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter">{formatCurrency(product.price)}</span>
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
                {enquiryNotice && (
                  <p className="rounded-lg bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-800">
                    {enquiryNotice}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between border-2 border-gray-200 rounded-xl bg-white sm:w-1/3">
                    <button 
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-4 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-l-xl disabled:opacity-30"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-2 text-xl font-black text-gray-900 w-12 text-center">{quantity}</span>
                    <button 
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-4 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-r-xl"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button 
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 bg-gray-900 hover:bg-yellow-500 text-white hover:text-gray-900 text-lg font-black py-4 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-3 group"
                  >
                    <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Add to Cart
                  </button>
                </div>

                {/* WhatsApp Enquire Button */}
                <button 
                  type="button"
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
                            <ProductCard product={item} variant="compact" />
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
            type="button"
            aria-label="Close image viewer"
            onClick={() => setIsFullScreen(false)}
            className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition z-50"
          >
            <X className="h-8 w-8" aria-hidden="true" />
          </button>
          
          <img 
            src={selectedImageLarge} 
            alt={product.name} 
            loading="eager"
            decoding="async"
            className="max-w-full max-h-[75vh] object-contain mb-8"
          />
          
          {product.images && product.images.length > 1 && (
            <div className="flex justify-center gap-4 overflow-x-auto max-w-full px-4 pb-4">
              {product.images.map((img, idx) => (
                <button
                  key={img.public_id || img.url || idx}
                  type="button"
                  aria-label={`View ${product.name} image ${idx + 1}`}
                  aria-pressed={selectedImage === img.url}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(img.url);
                  }}
                  className={`flex-shrink-0 w-20 h-20 bg-white rounded-lg border-2 p-1 transition-all ${
                    selectedImage === img.url ? 'border-yellow-500 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getOptimizedImageUrl(img.url, { width: 160 })}
                    alt={`Thumbnail ${idx}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
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
