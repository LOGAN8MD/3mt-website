import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}), { virtual: true });

const machine = { _id: 'machine-1', name: 'Concrete Mixer', condition: 'used' };

test('legacy products retain sale pricing and new/available defaults', () => {
  render(<ProductCard product={{ _id: 'legacy', name: 'Drill', price: 1000 }} />);
  expect(screen.getByText('New')).toBeInTheDocument();
  expect(screen.getByText('Available')).toBeInTheDocument();
  expect(screen.getByText('₹1,000')).toBeInTheDocument();
  expect(screen.queryByText('Rental rate')).not.toBeInTheDocument();
});

test.each(['day', 'week', 'month'])('rental-only card displays its %s rate without a zero sale price', (rentPeriod) => {
  render(<ProductCard product={{ ...machine, availabilityType: 'rent', availabilityStatus: 'on_rent', rentalPrice: 500, rentPeriod }} />);
  expect(screen.getByText('Second-Hand')).toBeInTheDocument();
  expect(screen.getByText('Currently on rent')).toBeInTheDocument();
  expect(screen.getByText(`/ ${rentPeriod}`).parentElement).toHaveTextContent(`₹500 / ${rentPeriod}`);
  expect(screen.queryByText('Sale price')).not.toBeInTheDocument();
  expect(screen.queryByText('₹0')).not.toBeInTheDocument();
});

test.each(['sold', 'unavailable'])('compact %s portfolio cards remain linked and show both offers', (availabilityStatus) => {
  render(<ProductCard variant="compact" product={{ ...machine, availabilityStatus, availabilityType: 'both', price: 50000, rentalPrice: 2000, rentPeriod: 'month' }} />);
  expect(screen.getByRole('link')).toHaveAttribute('href', '/product/machine-1');
  expect(screen.getByText(availabilityStatus === 'sold' ? 'Sold' : 'Unavailable')).toBeInTheDocument();
  expect(screen.getByText('Sale price')).toBeInTheDocument();
  expect(screen.getByText('Rental rate')).toBeInTheDocument();
});

test('missing rental price and period do not invent zero pricing', () => {
  render(<ProductCard product={{ ...machine, availabilityType: 'rent' }} />);
  expect(screen.getByText('Price on enquiry')).toBeInTheDocument();
  expect(screen.getByText('Period on enquiry')).toBeInTheDocument();
});
