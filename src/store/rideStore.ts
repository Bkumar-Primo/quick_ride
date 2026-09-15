import { create } from 'zustand';
import {
  CURRENT_LOCATION,
  MOCK_DRIVERS,
  MOCK_OFFERS,
  MOCK_VEHICLES,
  POPULAR_DESTINATIONS,
} from '../data';
import {
  type ActiveRide,
  DriverInfo,
  type LocationPoint,
  type PromoCode,
  type RideStatus,
  type VehicleOption,
} from '../types';
import { useUserStore } from './userStore';

interface RideState {
  currentStatus: RideStatus;
  pickup: LocationPoint;
  destination: LocationPoint | null;
  selectedVehicle: VehicleOption;
  appliedPromo: PromoCode | null;
  activeRide: ActiveRide | null;
  searchCountdown: number;

  // Actions
  setPickup: (loc: LocationPoint) => void;
  setDestination: (loc: LocationPoint | null) => void;
  setSelectedVehicle: (vehicle: VehicleOption) => void;
  applyPromo: (promo: PromoCode | null) => void;

  // Lifecycle triggers
  startSearchingForDriver: () => void;
  simulateDriverArrived: () => void;
  startTrip: () => void;
  completeTrip: (rating?: number, driverTip?: number, reviewTags?: string[]) => void;
  cancelRide: () => void;
  resetRide: () => void;
}

export const useRideStore = create<RideState>((set, get) => ({
  currentStatus: 'IDLE',
  pickup: CURRENT_LOCATION,
  destination: POPULAR_DESTINATIONS[0], // Default BKC for immediate quick demo
  selectedVehicle: MOCK_VEHICLES[1], // Quick Prime Sedan
  appliedPromo: MOCK_OFFERS[0], // QUICK50
  activeRide: null,
  searchCountdown: 3,

  setPickup: (loc) => set({ pickup: loc }),

  setDestination: (loc) => set({ destination: loc }),

  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

  applyPromo: (promo) => set({ appliedPromo: promo }),

  startSearchingForDriver: () => {
    const { pickup, destination, selectedVehicle, appliedPromo } = get();
    const dest = destination || POPULAR_DESTINATIONS[0];

    const baseFare = selectedVehicle.basePrice;
    const distanceFare = Math.round(selectedVehicle.price - baseFare);
    const tax = Math.round(selectedVehicle.price * 0.05);
    const discount = appliedPromo ? Math.min(appliedPromo.maxDiscount, 50) : 0;
    const totalFare = selectedVehicle.price + tax - discount;

    const newRide: ActiveRide = {
      id: `ride-${Date.now()}`,
      pickup,
      destination: dest,
      vehicle: selectedVehicle,
      driver: MOCK_DRIVERS[0], // Assigned on driver match
      otpPin: '4821',
      status: 'SEARCHING_DRIVER',
      distanceKm: 14.8,
      durationMin: 28,
      fareBreakdown: {
        baseFare,
        distanceFare,
        tax,
        discount,
        totalFare,
      },
      paymentMethod: 'QuickRide Wallet',
      createdAt: 'Just now',
    };

    set({
      currentStatus: 'SEARCHING_DRIVER',
      activeRide: newRide,
      searchCountdown: 3,
    });

    // Auto-advance simulation after 2.8 seconds so the demo is snappy and wowing!
    setTimeout(() => {
      const current = get().currentStatus;
      if (current === 'SEARCHING_DRIVER') {
        set({
          currentStatus: 'DRIVER_ASSIGNED',
          activeRide: {
            ...newRide,
            status: 'DRIVER_ASSIGNED',
            driver: MOCK_DRIVERS[0],
          },
        });
      }
    }, 2800);
  },

  simulateDriverArrived: () => {
    const active = get().activeRide;
    if (!active) return;
    set({
      currentStatus: 'DRIVER_ARRIVED',
      activeRide: {
        ...active,
        status: 'DRIVER_ARRIVED',
      },
    });
  },

  startTrip: () => {
    const active = get().activeRide;
    if (!active) return;
    set({
      currentStatus: 'RIDE_IN_PROGRESS',
      activeRide: {
        ...active,
        status: 'RIDE_IN_PROGRESS',
      },
    });
  },

  completeTrip: (rating = 5, driverTip = 0, reviewTags = ['Clean Car', 'Polite Driver']) => {
    const active = get().activeRide;
    if (!active) return;

    const completedRide: ActiveRide = {
      ...active,
      status: 'RIDE_COMPLETED',
      rating,
      driverTip,
      reviewTags,
    };

    // Save to user history
    useUserStore.getState().addCompletedRide(completedRide);

    set({
      currentStatus: 'RIDE_COMPLETED',
      activeRide: completedRide,
    });
  },

  cancelRide: () => {
    const active = get().activeRide;
    if (active) {
      useUserStore.getState().addCompletedRide({
        ...active,
        status: 'CANCELLED',
      });
    }
    set({
      currentStatus: 'IDLE',
      activeRide: null,
    });
  },

  resetRide: () => {
    set({
      currentStatus: 'IDLE',
      activeRide: null,
    });
  },
}));
