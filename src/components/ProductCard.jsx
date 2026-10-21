import { Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import { getOptimizedImageUrl } from '../utils/cloudinaryImage';

const variants = {
  default: {
    image: 'h-48 sm:h-56 p-4',
    imageIcon: 'h-12 w-12 mb-2',
    emptyText: 'text-xs',
    content: 'p-4 sm:p-5',
    badgeRow: 'gap-2 mb-3',
    brandBadge: 'px-2.5 py-1 text-[10px] sm:text-xs',
    categoryBadge: 'px-2 py-1 text-[10px] sm:text-xs',
    title: 'text-base sm:text-lg',
    priceBlock: 'pt-4',
    priceLabel: 'text-xs',
    price: 'text-lg sm:text-2xl',
  },
  compact: {
    image: 'h-40 sm:h-48 p-3 sm:p-4',
    imageIcon: 'h-8 w-8 sm:h-10 sm:w-10 mb-1 sm:mb-2',
    emptyText: 'text-[10px] sm:text-xs',
    content: 'p-3 sm:p-4',
    badgeRow: 'gap-1 sm:gap-2 mb-2 sm:mb-3',
    brandBadge: 'px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px]',
    categoryBadge: 'px-1.5 py-0.5 sm:px-2 sm:py-1 text-[9px] sm:text-[10px]',
    title: 'text-sm sm:text-base',
    priceBlock: 'pt-3 sm:pt-4',
    priceLabel: 'text-[10px] sm:text-xs',
    price: 'text-base sm:text-xl',
  },
};

function ProductCard({ product, variant = 'default' }) {
  const styles = variants[variant] || variants.default;
  const offer = product.availabilityType || 'sale';
  const statuses = {
    available: { label: 'Available', style: 'bg-green-100 text-green-800' },
    on_rent: { label: 'Currently on rent', style: 'bg-blue-100 text-blue-800' },
    unavailable: { label: 'Unavailable', style: 'bg-gray-200 text-gray-700' },
    sold: { label: 'Sold', style: 'bg-red-100 text-red-800' },
  };
  const status = statuses[product.availabilityStatus || 'available'] || statuses.unavailable;
  const priceText = (value) => value !== undefined && value !== null && value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0
    ? formatCurrency(value) : 'Price on enquiry';
  const period = ['day', 'week', 'month'].includes(product.rentPeriod) ? product.rentPeriod : null;
  const imageUrl = getOptimizedImageUrl(product.images?.[0]?.url, {
    width: variant === 'compact' ? 360 : 480,
  });

  return (
    <Link
      to={`/product/${product._id}`}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className={`relative flex w-full shrink-0 items-center justify-center overflow-hidden bg-gray-50/50 ${styles.image}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className={`${styles.imageIcon} opacity-20`} aria-hidden="true" />
            <span className={`${styles.emptyText} font-medium uppercase tracking-wider`}>No Image</span>
          </div>
        )}
      </div>

      <div className={`flex flex-grow flex-col ${styles.content}`}>
        <div className={`flex flex-wrap items-start justify-between break-words ${styles.badgeRow}`}>
          {product.brand && (
            <span className={`inline-block max-w-full rounded bg-yellow-100 font-bold uppercase text-yellow-800 ${styles.brandBadge}`}>
              {product.brand}
            </span>
          )}
          <span className={`ml-auto inline-block rounded bg-gray-100 font-semibold uppercase text-gray-600 line-clamp-1 ${styles.categoryBadge}`}>
            {product.category || product.type || 'Tool'}
          </span>
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5 text-xs font-semibold">
          <span className="rounded bg-yellow-100 px-2 py-1 text-yellow-900">{product.condition === 'used' ? 'Second-Hand' : 'New'}</span>
          <span className="rounded bg-gray-100 px-2 py-1 text-gray-700">{({ sale: 'For sale', rent: 'For rent', both: 'Sale and rent' })[offer] || 'Offer on enquiry'}</span>
          <span className={`rounded px-2 py-1 ${status.style}`}>{status.label}</span>
        </div>

        <h3 className={`mb-2 font-bold leading-tight text-gray-900 transition-colors line-clamp-2 group-hover:text-yellow-600 ${styles.title}`}>
          {product.name}
        </h3>

        <div className={`mt-auto space-y-2 border-t border-gray-100 ${styles.priceBlock}`}>
          {['sale', 'both'].includes(offer) && <div className="min-w-0">
            <span className={`block font-medium text-gray-500 ${styles.priceLabel}`}>Sale price</span>
            <span className={`block break-words font-extrabold text-gray-900 ${styles.price}`}>{priceText(product.price)}</span>
          </div>}
          {['rent', 'both'].includes(offer) && <div className="min-w-0">
            <span className={`block font-medium text-gray-500 ${styles.priceLabel}`}>Rental rate</span>
            <span className={`block break-words font-extrabold text-gray-900 ${styles.price}`}>{priceText(product.rentalPrice)}{period ? <span className="text-sm font-medium"> / {period}</span> : null}</span>
            {!period && <span className="text-xs text-gray-500">Period on enquiry</span>}
          </div>}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
