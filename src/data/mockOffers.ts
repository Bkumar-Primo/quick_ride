import type { PromoCode } from '../types';

export const MOCK_OFFERS: PromoCode[] = [
  {
    id: 'promo-first50',
    code: 'QUICK50',
    discountPercentage: 20,
    maxDiscount: 50,
    minAmount: 150,
    description: 'Get 20% off up to ₹50 on any city ride',
    expiresInDays: 7,
  },
  {
    id: 'promo-prime',
    code: 'PRIMEpremium',
    discountPercentage: 25,
    maxDiscount: 100,
    minAmount: 250,
    description: 'Flat ₹100 off on Prime premium bookings',
    expiresInDays: 3,
  },
  {
    id: 'promo-airport',
    code: 'AIRPORT40',
    discountPercentage: 15,
    maxDiscount: 150,
    minAmount: 400,
    description: 'Special 15% discount for Terminal 2 drops',
    expiresInDays: 14,
  },
];
