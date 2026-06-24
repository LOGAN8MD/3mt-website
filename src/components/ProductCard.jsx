import { Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';

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
  const imageUrl = product.images?.[0]?.url;

  return (
    <Link
      to={`/product/${product._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className={`relative flex w-full items-center justify-center overflow-hidden bg-gray-50/50 ${styles.image}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
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
        <div className={`flex items-start justify-between ${styles.badgeRow}`}>
          {product.brand && (
            <span className={`inline-block rounded-full bg-yellow-100 font-bold uppercase tracking-widest text-yellow-800 ${styles.brandBadge}`}>
              {product.brand}
            </span>
          )}
          <span className={`ml-auto inline-block rounded bg-gray-100 font-semibold uppercase text-gray-600 line-clamp-1 ${styles.categoryBadge}`}>
            {product.category || product.type || 'Tool'}
          </span>
        </div>

        <h3 className={`mb-2 font-bold leading-tight text-gray-900 transition-colors line-clamp-2 group-hover:text-yellow-600 ${styles.title}`}>
          {product.name}
        </h3>

        <div className={`mt-auto flex items-end justify-between border-t border-gray-50 ${styles.priceBlock}`}>
          <div className="flex flex-col">
            <span className={`mb-0.5 font-medium uppercase tracking-wide text-gray-400 ${styles.priceLabel}`}>Price</span>
            <span className={`font-extrabold tracking-tight text-gray-900 ${styles.price}`}>{formatCurrency(product.price)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
