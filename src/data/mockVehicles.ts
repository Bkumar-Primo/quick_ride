import { images } from '../../assets';
import type { RideGroup, VehicleOption } from '../types';

export const MOCK_VEHICLES: VehicleOption[] = [
  {
    id: 'veh-bike',
    name: 'Bike',
    tagline: 'Beat traffic, reach faster',
    group: 'bike',
    category: 'moto',
    capacity: 1,
    basePrice: 35,
    price: 49,
    etaMinutes: 2,
    badge: 'Fastest',
    badgeColor: '#FF6B00',
    iconName: 'bicycle',
    imageUrl: images.bikeLite,
  },
  {
    id: 'veh-bike-plus',
    name: 'Bike Plus',
    tagline: 'Helmet, extra comfort',
    group: 'bike',
    category: 'moto',
    capacity: 1,
    basePrice: 48,
    price: 69,
    etaMinutes: 3,
    iconName: 'bicycle',
    imageUrl: images.bikePlus,
  },
  {
    id: 'veh-auto',
    name: 'Auto',
    tagline: 'Everyday city rides',
    group: 'auto',
    category: 'auto',
    capacity: 3,
    basePrice: 62,
    price: 89,
    etaMinutes: 4,
    badge: 'Popular',
    badgeColor: '#FF6B00',
    iconName: 'bus-outline',
    imageUrl: images.auto,
  },
  {
    id: 'veh-quick',
    name: 'Mini',
    tagline: 'Affordable everyday cabs',
    group: 'cab',
    category: 'mini',
    capacity: 4,
    basePrice: 140,
    price: 180,
    etaMinutes: 3,
    badge: 'Best value',
    badgeColor: '#FF6B00',
    iconName: 'car-outline',
    imageUrl: images.cabEconomy,
  },
  {
    id: 'veh-comfort',
    name: 'Premium',
    tagline: 'More space, more comfort',
    group: 'cab',
    category: 'premium',
    capacity: 4,
    basePrice: 190,
    price: 240,
    etaMinutes: 5,
    iconName: 'car-sport-outline',
    imageUrl: images.cabPremium,
  },
  {
    id: 'veh-xl',
    name: 'SUV',
    tagline: 'For families & groups',
    group: 'cab',
    category: 'suv',
    capacity: 6,
    basePrice: 260,
    price: 320,
    etaMinutes: 7,
    iconName: 'car-outline',
    imageUrl: images.cabSuv,
  },
];

export const RIDE_GROUPS: {
  id: RideGroup;
  label: string;
  hint: string;
  icon: 'motorbike' | 'rickshaw' | 'car-side';
}[] = [
  { id: 'bike', label: 'Bike', hint: 'Fastest', icon: 'motorbike' },
  { id: 'auto', label: 'Auto', hint: 'Everyday', icon: 'rickshaw' },
  { id: 'cab', label: 'Cab', hint: 'Comfort', icon: 'car-side' },
];

export const vehiclesInGroup = (group: RideGroup): VehicleOption[] =>
  MOCK_VEHICLES.filter((vehicle) => vehicle.group === group);

export const startingFareForGroup = (group: RideGroup): number =>
  Math.min(...vehiclesInGroup(group).map((vehicle) => vehicle.price));

export const getVehicleById = (id: string): VehicleOption =>
  MOCK_VEHICLES.find((vehicle) => vehicle.id === id) ?? MOCK_VEHICLES[0];

export const vehicleCapacityLabel = (vehicle: VehicleOption): string =>
  vehicle.group === 'bike' ? '1 rider' : `${vehicle.capacity} seats`;
