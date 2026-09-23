import { images } from '../../assets';
import type { DriverInfo, VehicleOption } from '../types';

const CAR_IMAGE = images.cabPremium;
const BIKE_IMAGE = images.bikeLite;
const AUTO_IMAGE = images.auto;

export const MOCK_DRIVERS: DriverInfo[] = [
  {
    id: 'drv-bike',
    name: 'Suresh Yadav',
    phone: '+91 98110 33445',
    avatar: images.bikeLite,
    rating: 4.9,
    totalTrips: 3480,
    carModel: 'Hero Splender',
    carColor: 'Black',
    carNumber: 'HR 26 BK 2190',
    carCategory: 'Bike',
    carImageUrl: BIKE_IMAGE,
    coordinates: {
      latitude: 28.461,
      longitude: 77.028,
    },
  },
  {
    id: 'drv-auto',
    name: 'Manoj Yadav',
    phone: '+91 98712 22001',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    rating: 4.7,
    totalTrips: 1860,
    carModel: 'Bajaj RE',
    carColor: 'Yellow',
    carNumber: 'HR 26 AU 4401',
    carCategory: 'Auto',
    carImageUrl: AUTO_IMAGE,
    coordinates: {
      latitude: 28.46,
      longitude: 77.027,
    },
  },
  {
    id: 'drv-01',
    name: 'Rohit Kumar',
    phone: '+91 98201 45678',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    rating: 4.8,
    totalTrips: 1200,
    carModel: 'Maruti Suzuki Dzire',
    carColor: 'White',
    carNumber: 'HR 26 AB 1234',
    carCategory: 'Premium',
    carImageUrl: CAR_IMAGE,
    coordinates: {
      latitude: 28.461,
      longitude: 77.028,
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
    carColor: 'Silver',
    carNumber: 'HR 26 CD 4821',
    carCategory: 'Premium',
    carImageUrl: CAR_IMAGE,
    coordinates: {
      latitude: 28.463,
      longitude: 77.03,
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
    carColor: 'White',
    carNumber: 'HR 26 EF 9920',
    carCategory: 'Premium',
    carImageUrl: CAR_IMAGE,
    coordinates: {
      latitude: 28.458,
      longitude: 77.024,
    },
  },
];

export const driverForVehicle = (vehicle: VehicleOption): DriverInfo => {
  if (vehicle.group === 'bike') {
    return getDriverById('drv-bike');
  }
  if (vehicle.group === 'auto') {
    return getDriverById('drv-auto');
  }
  return getDriverById('drv-01');
};

export const getDriverById = (id: string): DriverInfo =>
  MOCK_DRIVERS.find((driver) => driver.id === id) ?? MOCK_DRIVERS[0];
