import React, { useState, useEffect } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { getPaginatedProducts, getProductFilterOptions } from '../services/productApi';
import ProductCard from '../components/ProductCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import ProductFilters from '../components/ProductFilters';
import VirtualizedProductGrid from '../components/VirtualizedProductGrid';

const PRODUCT_PAGE_SIZE = 24;
const SEARCH_DEBOUNCE_MS = 300;
const VIRTUALIZED_GRID_THRESHOLD = 72;

const initialFilters = {
  search: '',
  type: '',
  category: '',
  brand: '',
  minPrice: '',
  maxPrice: '',
  inStock: '',
  sort: 'newest',
};

function Products() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOptionsError, setFilterOptionsError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setFilterOptionsLoading(true);
    setFilterOptionsError(null);

    getProductFilterOptions({ signal: controller.signal })
      .then((data) => {
        setFilterOptions(data);
        setFilterOptionsLoading(false);
      })
      .catch((err) => {
        if (err.code !== 'ERR_CANCELED') {
          setFilterOptionsError(err.message || 'Failed to load product filters');
          setFilterOptionsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      const minPrice = Number(filters.minPrice);
      const maxPrice = Number(filters.maxPrice);

      if (filters.minPrice && filters.maxPrice && minPrice > maxPrice) {
        setProducts([]);
        setPagination(null);
        setError('Minimum price must be less than or equal to maximum price');
        setLoading(false);
        return;
      }

      const isFirstPage = currentPage === 1;
      setLoading(isFirstPage);
      setLoadingMore(!isFirstPage);
      setError(null);

      getPaginatedProducts(
        {
          page: currentPage,
          limit: PRODUCT_PAGE_SIZE,
          search: filters.search.trim(),
          type: filters.type,
          category: filters.category,
          brand: filters.brand,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          inStock: filters.inStock,
          sort: filters.sort,
        },
        { signal: controller.signal }
      )
        .then(({ products: productData, pagination: paginationData }) => {
          setProducts((currentProducts) => (
            isFirstPage ? productData : [...currentProducts, ...productData]
          ));
          setPagination(paginationData);
          setLoading(false);
          setLoadingMore(false);
        })
        .catch(err => {
          if (err.code !== 'ERR_CANCELED') {
            setError(err.message || 'Failed to fetch products');
            setLoading(false);
            setLoadingMore(false);
          }
        });

    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [filters, currentPage]);

  const handleFiltersChange = (nextFilters) => {
    setCurrentPage(1);
    setFilters(nextFilters);
  };

  const handleSearchChange = (event) => {
    setCurrentPage(1);
    setFilters((currentFilters) => ({
      ...currentFilters,
      search: event.target.value,
    }));
  };

  const handleClearFilters = () => {
    setCurrentPage(1);
    setFilters(initialFilters);
    setShowMobileFilters(false);
  };

  const handleLoadMore = () => {
    if (!pagination?.hasNextPage || loading || loadingMore) return;
    setCurrentPage((page) => page + 1);
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sort') return value !== initialFilters.sort;
    return value !== '';
  }).length;

  if (loading && products.length === 0 && !pagination && !error) {
    return <LoadingState label="Loading products" />;
  }

  const totalProducts = pagination?.total ?? products.length;
  const hasMoreProducts = Boolean(pagination?.hasNextPage);
  const useVirtualizedGrid = products.length >= VIRTUALIZED_GRID_THRESHOLD;

  return (
    <section className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="animate-fade-in">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Our Product Range</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover high-quality tools and machinery for construction and industrial work.</p>
          </div>

          <div className="mx-auto mb-8 max-w-2xl">
            <label htmlFor="catalog-search" className="sr-only">Search products</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                id="catalog-search"
                type="search"
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search products by name, brand, model, category, or type"
                className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-base font-medium text-gray-900 shadow-sm outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
              />
            </div>
          </div>

          {filterOptionsError && (
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-800">
              {filterOptionsError}
            </div>
          )}

          <div className="mb-6 flex flex-col gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setShowMobileFilters((current) => !current)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-gray-800"
            >
              {showMobileFilters ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
              {showMobileFilters ? 'Hide Filters' : `Show Filters${activeFilterCount ? ` (${activeFilterCount})` : ''}`}
            </button>
            {showMobileFilters && (
              <ProductFilters
                filters={filters}
                filterOptions={filterOptions}
                onChange={handleFiltersChange}
                onClear={handleClearFilters}
              />
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
            <ProductFilters
              filters={filters}
              filterOptions={filterOptions}
              onChange={handleFiltersChange}
              onClear={handleClearFilters}
              className="sticky top-24 hidden lg:block"
            />

            <div>
              <div className="mb-6 flex flex-col gap-2 border-b border-gray-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Latest Products</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Showing {products.length} of {totalProducts} products
                    {activeFilterCount > 0 ? ` with ${activeFilterCount} active filter${activeFilterCount > 1 ? 's' : ''}` : ''}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-500">
                  Page {pagination?.page ?? 1} of {pagination?.totalPages ?? 1}
                </p>
              </div>

              {filterOptionsLoading ? (
                <div className="mb-6 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-500">
                  Loading filter options...
                </div>
              ) : null}

              {loading ? (
                <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
                  Updating products...
                </div>
              ) : null}

              {error ? (
                <ErrorState message={error} />
              ) : products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-xl">No products found.</p>
                </div>
              ) : (
                <>
                  {useVirtualizedGrid ? (
                    <VirtualizedProductGrid products={products} />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  )}

                  <div className="mt-10 flex flex-col items-center gap-3">
                    {hasMoreProducts ? (
                      <button
                        type="button"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="inline-flex min-w-40 items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-yellow-500 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loadingMore ? 'Loading...' : 'Load More'}
                      </button>
                    ) : (
                      <p className="text-sm font-medium text-gray-500">All matching products are loaded.</p>
                    )}
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Showing {products.length} of {totalProducts}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Products;
