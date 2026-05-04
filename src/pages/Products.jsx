import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

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
    <div className="p-4 bg-white shadow-lg rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col border border-gray-100">
      <div className="w-full h-48 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden mb-4 p-2">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0].url} alt={product.name} className="max-h-full object-contain mix-blend-multiply" />
        ) : (
          <span className="text-gray-400">No image</span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 leading-tight min-h-[3rem]">{product.name}</h3>
      <p className="text-sm text-gray-500 mt-2 mb-3">{product.brand}</p>
      <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100">
        <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
        <button className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow hover:bg-yellow-600 transition-colors text-sm">
          Details
        </button>
      </div>
    </div>
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
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedProducts.map(product => (
                          <ProductCard key={product._id} product={product} />
                        ))}
                      </div>
                      
                      {hasMore && (
                        <div className="mt-8 text-center sm:hidden">
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