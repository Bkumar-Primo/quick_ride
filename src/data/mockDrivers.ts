import type { DriverInfo } from '../types';

export const MOCK_DRIVERS: DriverInfo[] = [
  {
    id: 'drv-01',
    name: 'Rahul Sharma',
    phone: '+91 98201 45678',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    rating: 4.88,
    totalTrips: 1842,
    carModel: 'White Honda City Sedan',
    carColor: 'Pearl White',
    carNumber: 'KA 01 AB 1234',
    coordinates: {
      latitude: 19.172,
      longitude: 72.859,
    },
  },
  {
    id: 'drv-02',
    name: 'Vikram Singh',
    phone: '+91 98334 11223',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    rating: 4.93,
    totalTrips: 2410,
    carModel: 'Hyundai Verna',
    carColor: 'Silver Metallic',
    carNumber: 'MH 02 CD 4821',
    coordinates: {
      latitude: 19.1755,
      longitude: 72.8635,
    },
  },
  {
    id: 'drv-03',
    name: 'Amit Patel',
    phone: '+91 99670 99881',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    rating: 4.79,
    totalTrips: 960,
    carModel: 'Maruti Suzuki Dzire',
    carColor: 'Glacier White',
    carNumber: 'MH 03 EF 9920',
    coordinates: {
      latitude: 19.1702,
      longitude: 72.865,
    },
  },
];
