import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
    spare: []
  };

  relatedProducts.forEach(r => {
    const t = r.type?.toLowerCase().trim();
    if (relatedByType[t]) {
      relatedByType[t].push(r);
    }
  });

  const ProductCard = ({ prod }) => (
    <div className="p-4 bg-white shadow-lg rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col border border-gray-100 h-full">
      <div className="w-full h-48 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden mb-4 p-2">
        {prod.images && prod.images.length > 0 ? (
          <img src={prod.images[0].url} alt={prod.name} className="max-h-full object-contain mix-blend-multiply" />
        ) : (
          <span className="text-gray-400">No image</span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 leading-tight min-h-[3rem]">{prod.name}</h3>
      <p className="text-sm text-gray-500 mt-2 mb-3">{prod.brand}</p>
      <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100">
        <span className="text-xl font-bold text-gray-900">₹{prod.price}</span>
        <Link to={`/product/${prod._id}`} className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow hover:bg-yellow-600 transition-colors text-sm">
          Details
        </Link>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-10 border border-gray-100">
          <button 
            onClick={() => navigate(-1)}
            className="mb-8 text-gray-500 hover:text-gray-800 font-medium flex items-center gap-2 transition"
          >
            &larr; Back
          </button>

          {/* 1. Product Name First */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 leading-tight text-center">
            {product.name}
          </h1>
          
          {/* 2. Product Image Gallery */}
          <div className="mb-10 max-w-3xl mx-auto">
            <div 
              className="w-full flex items-center justify-center bg-gray-50 rounded-xl p-8 border border-gray-100 cursor-zoom-in transition-transform hover:shadow-md"
              onClick={() => product.images?.length > 0 && setIsFullScreen(true)}
              title="Click to view full screen"
            >
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt={product.name} 
                  className="w-full h-auto max-h-[400px] object-contain mix-blend-multiply" 
                />
              ) : (
                <div className="py-20 text-gray-400">No image available</div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex justify-center gap-4 mt-6 overflow-x-auto pb-2 px-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img.url)}
                    className={`flex-shrink-0 w-20 h-20 bg-white rounded-lg border-2 p-1 overflow-hidden transition-all ${
                      selectedImage === img.url ? 'border-yellow-500 shadow-md scale-105' : 'border-gray-200 hover:border-yellow-300'
                    }`}
                  >
                    <img src={img.url} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            {/* 3. Size (if not empty) */}
            {product.size && product.size.trim() !== '' && (
              <div className="flex items-center gap-3 bg-gray-50 p-5 rounded-xl border border-gray-100">
                <span className="text-gray-500 uppercase tracking-wider text-sm font-bold">Size/Capacity:</span>
                <span className="font-semibold text-gray-900 text-lg">{product.size}</span>
              </div>
            )}

            {/* 4. Price */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-yellow-50 p-6 rounded-xl border border-yellow-100 shadow-sm">
              <span className="text-yellow-800 uppercase tracking-wider text-sm font-bold">Price</span>
              <span className="font-extrabold text-yellow-900 text-3xl">₹{product.price}</span>
            </div>

            {/* 5. Product Description */}
            {product.description && product.description.trim() !== '' && (
              <div className="pt-8 mt-8 border-t border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">{product.description}</p>
              </div>
            )}

            <div className="pt-8">
              <button className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl shadow-lg transition-colors flex justify-center items-center gap-2">
                Enquire About This Product
              </button>
            </div>
          </div>
        </div>

        {/* --- Related Products Section --- */}
        <div className="mt-16 space-y-12">
          {['machine', 'accessory', 'part', 'spare'].map(type => {
            const items = relatedByType[type];
            // Only render the section if there are related items
            if (!items || items.length === 0) return null;
            
            return (
              <div key={type} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-8 bg-yellow-400 rounded-full"></span>
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">
                    Related {type === 'accessory' ? 'Accessories' : type + 's'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map(item => (
                    <ProductCard key={item._id} prod={item} />
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
