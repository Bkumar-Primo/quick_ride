import type { ActiveRide } from '../types';
import { MOCK_DRIVERS } from './mockDrivers';
import { CURRENT_LOCATION, POPULAR_DESTINATIONS } from './mockLocations';
import { MOCK_VEHICLES } from './mockVehicles';

export const MOCK_RIDE_HISTORY: ActiveRide[] = [
  {
    id: 'ride-hist-101',
    pickup: CURRENT_LOCATION,
    destination: POPULAR_DESTINATIONS[0], // BKC
    vehicle: MOCK_VEHICLES[1], // Prime Sedan
    driver: MOCK_DRIVERS[0], // Rahul Sharma
    otpPin: '4821',
    status: 'RIDE_COMPLETED',
    distanceKm: 14.8,
    durationMin: 32,
    fareBreakdown: {
      baseFare: 180,
      distanceFare: 118,
      tax: 15,
      discount: 34,
      totalFare: 279,
    },
    paymentMethod: 'QuickRide Wallet',
    createdAt: 'Today, 09:15 AM',
    rating: 5,
    reviewTags: ['Clean Car', 'Polite Driver', 'Smooth Driving'],
    driverTip: 30,
  },
  {
    id: 'ride-hist-102',
    pickup: POPULAR_DESTINATIONS[1], // Airport
    destination: POPULAR_DESTINATIONS[5], // Home
    vehicle: MOCK_VEHICLES[0], // Mini
    driver: MOCK_DRIVERS[1], // Vikram Singh
    otpPin: '1904',
    status: 'RIDE_COMPLETED',
    distanceKm: 18.2,
    durationMin: 42,
    fareBreakdown: {
      baseFare: 120,
      distanceFare: 145,
      tax: 18,
      discount: 0,
      totalFare: 283,
    },
    paymentMethod: 'Google Pay',
    createdAt: 'Yesterday, 10:45 PM',
    rating: 5,
    reviewTags: ['On-time Arrival', 'Great Music'],
  },
  {
    id: 'ride-hist-103',
    pickup: POPULAR_DESTINATIONS[2], // Powai
    destination: CURRENT_LOCATION,
    vehicle: MOCK_VEHICLES[3], // Moto
    driver: MOCK_DRIVERS[2], // Amit Patel
    otpPin: '6712',
    status: 'RIDE_COMPLETED',
    distanceKm: 8.5,
    durationMin: 22,
    fareBreakdown: {
      baseFare: 50,
      distanceFare: 39,
      tax: 6,
      discount: 6,
      totalFare: 89,
    },
    paymentMethod: 'Cash',
    createdAt: '12 Sep, 02:10 PM',
    rating: 4,
    reviewTags: ['Fast Route'],
  },
  {
    id: 'ride-hist-104',
    pickup: CURRENT_LOCATION,
    destination: POPULAR_DESTINATIONS[3], // Juhu Beach
    vehicle: MOCK_VEHICLES[2], // XL SUV
    driver: MOCK_DRIVERS[0],
    otpPin: '8201',
    status: 'CANCELLED',
    distanceKm: 11.0,
    durationMin: 28,
    fareBreakdown: {
      baseFare: 280,
      distanceFare: 159,
      tax: 22,
      discount: 0,
      totalFare: 461,
    },
    paymentMethod: 'Credit Card',
    createdAt: '10 Sep, 07:30 PM',
  },
];
