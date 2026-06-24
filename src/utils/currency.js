const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatCurrency = (value) => {
  const amount = Number(value);
  return inrFormatter.format(Number.isFinite(amount) ? amount : 0);
};
