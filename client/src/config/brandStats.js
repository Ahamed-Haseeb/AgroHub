// brand panel stats shown on login/register pages
export const brandStats = [
  { value: '2,847', label: 'Farmers' },
  { value: '38%', label: 'Waste Cut' },
  { value: '+42%', label: 'Price Gain' },
  { value: '24hr', label: 'Delivery' },
];

// register page uses a different last stat
export const registerBrandStats = [
  ...brandStats.slice(0, 3),
  { value: '6', label: 'Districts' },
];
