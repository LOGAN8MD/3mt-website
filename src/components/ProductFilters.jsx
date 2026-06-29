import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'priceAsc', label: 'Price: Low to High' },
  { value: 'priceDesc', label: 'Price: High to Low' },
  { value: 'nameAsc', label: 'Name: A-Z' },
  { value: 'nameDesc', label: 'Name: Z-A' },
];

const stockOptions = [
  { value: '', label: 'Any stock' },
  { value: 'true', label: 'In stock' },
  { value: 'false', label: 'Out of stock' },
];

function ProductFilters({ filters, filterOptions, onChange, onClear, className = '' }) {
  const brands = filterOptions?.brands || [];
  const categories = filterOptions?.categories || [];
  const types = filterOptions?.types || [];
  const priceRange = filterOptions?.priceRange || {};

  const updateFilter = (field, value) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <aside className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-yellow-500" aria-hidden="true" />
          <h2 className="text-lg font-black text-gray-900">Filters</h2>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Clear
        </button>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">Search</span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              placeholder="Search products"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-100"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">Type</span>
          <select
            value={filters.type}
            onChange={(event) => updateFilter('type', event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-100"
          >
            <option value="">All types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">Category</span>
          <select
            value={filters.category}
            onChange={(event) => updateFilter('category', event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-100"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">Brand</span>
          <select
            value={filters.brand}
            onChange={(event) => updateFilter('brand', event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-100"
          >
            <option value="">All brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">Price Range</span>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={(event) => updateFilter('minPrice', event.target.value)}
              placeholder={priceRange.min ? `Min ${priceRange.min}` : 'Min'}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-100"
            />
            <input
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={(event) => updateFilter('maxPrice', event.target.value)}
              placeholder={priceRange.max ? `Max ${priceRange.max}` : 'Max'}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-100"
            />
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">Stock</span>
          <select
            value={filters.inStock}
            onChange={(event) => updateFilter('inStock', event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-100"
          >
            {stockOptions.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">Sort</span>
          <select
            value={filters.sort}
            onChange={(event) => updateFilter('sort', event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-100"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </aside>
  );
}

export default ProductFilters;
