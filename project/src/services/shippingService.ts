import type { CountryOption, DestinationCountry } from '../types';

export const COUNTRIES: CountryOption[] = [
  { code: 'SWEDEN', name: 'Sweden', multiplier: 7.35 },
  { code: 'CHINA', name: 'China', multiplier: 11.53 },
  { code: 'BRAZIL', name: 'Brazil', multiplier: 15.63 },
  { code: 'AUSTRALIA', name: 'Australia', multiplier: 50.09 },
];

export const calculateShippingCost = (
  weight: number,
  destinationCountry: DestinationCountry
): number => {
  const country = COUNTRIES.find((c) => c.code === destinationCountry);
  if (!country) {
    throw new Error('Invalid destination country');
  }
  return weight * country.multiplier;
};

export const getCountryName = (code: DestinationCountry): string => {
  const country = COUNTRIES.find((c) => c.code === code);
  return country?.name || code;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const rgbStringToObject = (rgb: string): { r: number; g: number; b: number } => {
  const [r, g, b] = rgb.split(',').map(Number);
  return { r, g, b };
};

export const rgbObjectToString = (r: number, g: number, b: number): string => {
  return `${r},${g},${b}`;
};
