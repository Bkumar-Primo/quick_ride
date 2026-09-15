export type RideStatus =
  | 'IDLE'
  | 'SELECTING_LOCATION'
  | 'SELECTING_VEHICLE'
  | 'SEARCHING_DRIVER'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_ARRIVED'
  | 'RIDE_IN_PROGRESS'
  | 'RIDE_COMPLETED'
  | 'CANCELLED';

export interface LocationPoint {
  id: string;
  title: string;
  subtitle: string;
  address: string;
  latitude: number;
  longitude: number;
  type?: 'home' | 'work' | 'recent' | 'airport' | 'popular' | 'custom';
}

export interface VehicleOption {
  id: string;
  name: string;
  tagline: string;
  category: 'mini' | 'sedan' | 'suv' | 'moto' | 'auto';
  capacity: number;
  basePrice: number;
  price: number;
  etaMinutes: number;
  badge?: string;
  badgeColor?: string;
  iconName: string;
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  totalTrips: number;
  carModel: string;
  carColor: string;
  carNumber: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface ActiveRide {
  id: string;
  pickup: LocationPoint;
  destination: LocationPoint;
  vehicle: VehicleOption;
  driver?: DriverInfo;
  otpPin: string;
  status: RideStatus;
  fareBreakdown: {
    baseFare: number;
    distanceFare: number;
    tax: number;
    discount: number;
    totalFare: number;
  };
  distanceKm: number;
  durationMin: number;
  paymentMethod: 'Cash' | 'QuickRide Wallet' | 'Google Pay' | 'Apple Pay' | 'Credit Card';
  createdAt: string;
  rating?: number;
  reviewTags?: string[];
  driverTip?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  rating: number;
  totalRides: number;
  walletBalance: number;
  memberSince: string;
  savedPlaces: LocationPoint[];
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  minAmount: number;
  description: string;
  expiresInDays: number;
}
