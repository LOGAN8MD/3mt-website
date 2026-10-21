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
  const used = filters.condition === 'used';
  const renting = used && ['rent', 'both'].includes(filters.availabilityType);
  const selectClass = 'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-yellow-100';
  const visibleSortOptions = sortOptions.filter((option) =>
    !option.value.startsWith('price') || !used || ['sale', 'both'].includes(filters.availabilityType));
  if (renting && filters.rentPeriod) visibleSortOptions.push(
    { value: 'rentalPriceAsc', label: 'Rental rate: Low to High' },
    { value: 'rentalPriceDesc', label: 'Rental rate: High to Low' },
  );

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
        <label className="flex cursor-pointer items-center justify-between gap-3 border-b border-gray-200 pb-5">
          <span className="text-sm font-bold text-gray-900">Second-Hand Machines</span>
          <span className="relative inline-flex h-6 w-11 shrink-0">
            <input
              type="checkbox"
              role="switch"
              checked={filters.condition === 'used'}
              onChange={(event) => updateFilter('condition', event.target.checked ? 'used' : '')}
              className="peer sr-only"
            />
            <span aria-hidden="true" className="absolute inset-0 rounded-full bg-gray-300 transition-colors peer-checked:bg-yellow-500 peer-focus-visible:ring-2 peer-focus-visible:ring-gray-900 peer-focus-visible:ring-offset-2" />
            <span aria-hidden="true" className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
          </span>
        </label>
        {used && <>
          <label className="block text-sm font-bold text-gray-700">
            Offer
            <select className={selectClass} value={filters.availabilityType} onChange={(event) => updateFilter('availabilityType', event.target.value)}>
              <option value="">All offers</option>
              <option value="sale">For sale</option>
              <option value="rent">For rent</option>
              <option value="both">Sale and rent</option>
            </select>
          </label>
          <label className="block text-sm font-bold text-gray-700">
            Availability
            <select className={selectClass} value={filters.availabilityStatus} onChange={(event) => updateFilter('availabilityStatus', event.target.value)}>
              <option value="">All statuses</option>
              <option value="available">Available now</option>
              <option value="on_rent">Currently on rent</option>
              <option value="unavailable">Unavailable</option>
              <option value="sold">Sold</option>
            </select>
          </label>
          {renting && <label className="block text-sm font-bold text-gray-700">
            Rental period
            <select className={selectClass} value={filters.rentPeriod} onChange={(event) => updateFilter('rentPeriod', event.target.value)}>
              <option value="">All periods</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </label>}
          {renting && filters.rentPeriod && <fieldset>
            <legend className="mb-2 text-sm font-bold text-gray-700">Rental rate per {filters.rentPeriod}</legend>
            <div className="grid grid-cols-2 gap-3">
              <input aria-label="Minimum rental rate" type="number" min="0" className={selectClass} placeholder="Min" value={filters.minRentalPrice} onChange={(event) => updateFilter('minRentalPrice', event.target.value)} />
              <input aria-label="Maximum rental rate" type="number" min="0" className={selectClass} placeholder="Max" value={filters.maxRentalPrice} onChange={(event) => updateFilter('maxRentalPrice', event.target.value)} />
            </div>
          </fieldset>}
        </>}
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

        {filters.condition !== 'used' && <label className="block">
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
        </label>}

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

        {(!used || ['sale', 'both'].includes(filters.availabilityType)) && <div>
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
        </div>}

        {!used && <label className="block">
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
        </label>}

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">Sort</span>
          <select
            value={filters.sort}
            onChange={(event) => updateFilter('sort', event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-100"
          >
            {visibleSortOptions.map((option) => (
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
