import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    axiosInstance.get('/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch products');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-10 text-center text-red-500 text-xl">{error}</div>;
  }

  // Group products by normalized category
  const productsByCategory = products.reduce((acc, product) => {
    // Normalize category string to avoid mismatches like "Grinder" vs "Grinder "
    const cat = product.category ? product.category.trim() : 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  const typePriority = {
    machine: 1,
    accessory: 2,
    part: 3,
    spare: 4,
    tool: 5
  };

  const categories = Object.keys(productsByCategory).sort((a, b) => {
    // Determine priority based on the type of the first product in the category
    const typeA = (productsByCategory[a][0].type || '').toLowerCase().trim();
    const typeB = (productsByCategory[b][0].type || '').toLowerCase().trim();

    const priorityA = typePriority[typeA] || 99;
    const priorityB = typePriority[typeB] || 99;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    return a.localeCompare(b);
  });

  const ProductCard = ({ product }) => (
    <Link to={`/product/${product._id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-gray-100 overflow-hidden h-full cursor-pointer block">
      {/* Image Container */}
      <div className="relative w-full h-48 sm:h-56 bg-gray-50/50 flex items-center justify-center p-4 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0].url} 
            alt={product.name} 
            className="max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span className="text-xs font-medium uppercase tracking-wider">No Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-3">
          {product.brand && (
            <span className="inline-block px-2.5 py-1 bg-yellow-100 text-yellow-800 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full">
              {product.brand}
            </span>
          )}
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-[10px] sm:text-xs font-semibold rounded uppercase line-clamp-1 text-right">
            {product.category || product.type || 'Tool'}
          </span>
        </div>
        
        <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-yellow-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-4 flex justify-between items-end border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Price</span>
            <span className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">₹{product.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <section className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {selectedCategory ? (
          <div className="animate-fade-in">
            <button 
              onClick={() => setSelectedCategory(null)}
              className="mb-8 px-5 py-2.5 bg-white border border-gray-200 text-gray-800 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center gap-2"
            >
              &larr; Back to Categories
            </button>
            <div className="mb-8 border-b pb-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 capitalize">{selectedCategory}</h1>
              <p className="text-gray-500 mt-2">Showing all {productsByCategory[selectedCategory].length} products in this category</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsByCategory[selectedCategory].map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Our Product Range</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our extensive collection of high-quality tools and machinery for all your construction and industrial needs.</p>
            </div>
            
            {categories.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-xl">No products found.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {categories.map(cat => {
                  const categoryProducts = productsByCategory[cat];
                  const displayedProducts = categoryProducts.slice(0, 3);
                  const hasMore = categoryProducts.length > 3;
                  
                  return (
                    <div key={cat} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 capitalize flex items-center gap-3">
                            <span className="w-2 h-8 bg-yellow-400 rounded-full"></span>
                            {cat}
                          </h2>
                          <p className="text-gray-500 text-sm mt-1 ml-5">{categoryProducts.length} items available</p>
                        </div>
                        {hasMore && (
                          <button 
                            onClick={() => setSelectedCategory(cat)}
                            className="hidden sm:inline-flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                          >
                            View All {cat} &rarr;
                          </button>
                        )}
                      </div>
                      
                      {/* Desktop Grid View */}
                      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedProducts.map(product => (
                          <ProductCard key={product._id} product={product} />
                        ))}
                      </div>

                      {/* Mobile Carousel View */}
                      <div className="sm:hidden -mx-2 px-2">
                        <Swiper
                          modules={[Pagination, Autoplay]}
                          pagination={{ clickable: true, dynamicBullets: true }}
                          autoplay={{ delay: 2000, disableOnInteraction: false }}
                          spaceBetween={16}
                          slidesPerView={1.15}
                          className="!pb-10"
                        >
                          {displayedProducts.map(product => (
                            <SwiperSlide key={product._id} className="h-auto">
                              <ProductCard product={product} />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                      
                      {hasMore && (
                        <div className="mt-2 text-center sm:hidden">
                          <button 
                            onClick={() => setSelectedCategory(cat)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            View All {categoryProducts.length} Products
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Products;