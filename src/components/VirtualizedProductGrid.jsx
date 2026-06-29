import { useEffect, useRef, useState } from 'react';
import { Grid } from 'react-window';
import ProductCard from './ProductCard';

const GRID_GAP = 24;
const ROW_HEIGHT = 390;
const MAX_GRID_HEIGHT = 860;

const getColumnCount = (width) => {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
};

function ProductCell({ ariaAttributes, columnIndex, rowIndex, style, products, columnCount }) {
  const productIndex = rowIndex * columnCount + columnIndex;
  const product = products[productIndex];

  if (!product) return null;

  return (
    <div
      {...ariaAttributes}
      style={{
        ...style,
        paddingRight: GRID_GAP,
        paddingBottom: GRID_GAP,
      }}
    >
      <ProductCard product={product} />
    </div>
  );
}

function VirtualizedProductGrid({ products }) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const columnCount = getColumnCount(containerWidth);
  const rowCount = Math.ceil(products.length / columnCount);
  const gridHeight = Math.min(rowCount * ROW_HEIGHT, MAX_GRID_HEIGHT);

  return (
    <div ref={containerRef} className="-mr-6">
      {containerWidth > 0 && (
        <Grid
          cellComponent={ProductCell}
          cellProps={{ products, columnCount }}
          columnCount={columnCount}
          columnWidth={`${100 / columnCount}%`}
          defaultHeight={gridHeight}
          defaultWidth={containerWidth}
          overscanCount={2}
          rowCount={rowCount}
          rowHeight={ROW_HEIGHT}
          style={{
            height: gridHeight,
            width: '100%',
          }}
        />
      )}
    </div>
  );
}

export default VirtualizedProductGrid;
