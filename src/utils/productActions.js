export const getProductActions = (product, intent, cartQuantity = 0) => {
  const offer = product?.availabilityType || 'sale';
  const status = product?.availabilityStatus || 'available';
  const rental = intent === 'rent';
  const supported = rental ? ['rent', 'both'].includes(offer) : ['sale', 'both'].includes(offer);
  const stock = product?.stock;
  const limit = stock !== undefined && stock !== null && stock !== '' && Number.isFinite(Number(stock))
    ? Math.max(0, Math.floor(Number(stock))) : 1;
  const remaining = Math.max(0, limit - cartQuantity);
  const canEnquire = supported && (status === 'available' || (status === 'on_rent' && rental)) && (rental || limit > 0);
  return { canEnquire, canAdd: canEnquire && !rental && status === 'available' && remaining > 0, limit, remaining };
};
