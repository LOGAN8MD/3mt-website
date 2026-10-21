import { act, fireEvent, render, screen } from '@testing-library/react';
import Products from './Products';
import { getPaginatedProducts, getProductFilterOptions } from '../services/productApi';

jest.mock('../services/productApi', () => ({
  getPaginatedProducts: jest.fn(),
  getProductFilterOptions: jest.fn(),
}));
jest.mock('../components/ProductCard', () => ({ product }) => <div>{product.name}</div>);
jest.mock('../components/VirtualizedProductGrid', () => () => null);

const flushSearch = async () => {
  await act(async () => { jest.advanceTimersByTime(300); });
};

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  getProductFilterOptions.mockResolvedValue({ types: ['machine', 'tool'] });
  getPaginatedProducts.mockImplementation(async ({ condition, page }) => ({
    products: [{ _id: String(page), name: condition === 'used' ? 'Used mixer' : 'New mixer' }],
    pagination: { page, total: 48, totalPages: 2, hasNextPage: page === 1 },
  }));
});

afterEach(() => jest.useRealTimers());

test('rental filters send period-specific prices and reset when offer changes', async () => {
  render(<Products />);
  await flushSearch();
  fireEvent.click(screen.getByRole('switch'));
  await flushSearch();
  fireEvent.change(screen.getByLabelText('Offer'), { target: { value: 'rent' } });
  await flushSearch();
  expect(screen.queryByLabelText('Minimum rental rate')).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Rental period'), { target: { value: 'month' } });
  fireEvent.change(screen.getByLabelText('Minimum rental rate'), { target: { value: '100' } });
  fireEvent.change(screen.getByLabelText('Availability'), { target: { value: 'on_rent' } });
  await flushSearch();
  expect(getPaginatedProducts.mock.calls.at(-1)[0]).toMatchObject({ availabilityType: 'rent', availabilityStatus: 'on_rent', rentPeriod: 'month', minRentalPrice: '100' });
  fireEvent.change(screen.getByLabelText('Offer'), { target: { value: 'sale' } });
  await flushSearch();
  expect(getPaginatedProducts.mock.calls.at(-1)[0]).toMatchObject({ rentPeriod: '', minRentalPrice: '', sort: 'newest' });
  expect(screen.queryByLabelText('Rental period')).not.toBeInTheDocument();
});

test('switching resets pagination and incompatible type; clear restores new catalog', async () => {
  render(<Products />);
  await flushSearch();
  fireEvent.change(screen.getByLabelText('Type'), { target: { value: 'tool' } });
  await flushSearch();
  fireEvent.click(screen.getByRole('button', { name: 'Load More' }));
  await flushSearch();
  expect(getPaginatedProducts.mock.calls.at(-1)[0].page).toBe(2);

  fireEvent.click(screen.getByRole('switch', { name: 'Second-Hand Machines' }));
  expect(screen.queryByText('New mixer')).not.toBeInTheDocument();
  await flushSearch();
  expect(getPaginatedProducts.mock.calls.at(-1)[0]).toMatchObject({ condition: 'used', type: '', page: 1 });
  expect(screen.getByText('Used mixer')).toBeInTheDocument();
  expect(screen.queryByLabelText('Type')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
  await flushSearch();
  expect(screen.getByRole('switch')).not.toBeChecked();
  expect(getPaginatedProducts.mock.calls.at(-1)[0]).toMatchObject({ condition: '', page: 1 });
  expect(screen.queryByText('Used mixer')).not.toBeInTheDocument();
});

test('mobile filter switch updates shared state and ignores a late old response', async () => {
  let resolveOld;
  getPaginatedProducts.mockImplementationOnce(() => new Promise((resolve) => { resolveOld = resolve; }));
  render(<Products />);
  await flushSearch();
  fireEvent.click(screen.getByRole('button', { name: /Show Filters/ }));
  fireEvent.click(screen.getAllByRole('switch')[0]);
  await flushSearch();
  expect(screen.getAllByRole('switch').every((toggle) => toggle.checked)).toBe(true);
  await act(async () => resolveOld({ products: [{ _id: 'old', name: 'Stale new product' }], pagination: null }));
  expect(screen.queryByText('Stale new product')).not.toBeInTheDocument();
  expect(screen.getByText('Used mixer')).toBeInTheDocument();
});
