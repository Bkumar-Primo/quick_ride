import { create } from 'zustand';
import {
  CP67_MALL_DESTINATION,
  CURRENT_LOCATION,
  driverForVehicle,
  MOCK_OFFERS,
  MOCK_VEHICLES,
  POPULAR_DESTINATIONS,
  SM_HEIGHTS_PICKUP,
} from '../data';
import type { ActiveRide, LocationPoint, PromoCode, RideStatus, VehicleOption } from '../types';
import { useUserStore } from './userStore';

const DRIVER_ARRIVAL_DELAY_MS = 15000; // 15 seconds heading to pickup
const TRIP_START_DELAY_MS = 3000; // 3 seconds pause at pickup
const RIDE_END_DELAY_MS = 30000; // 30 seconds pickup to destination

export type FlowStep =
  | 'IDLE'
  | 'LOCATION_SEARCH'
  | 'PICKUP_CONFIRM'
  | 'ROUTE_PREVIEW'
  | 'BOOKING_CONFIRM'
  | 'SEARCHING_DRIVER'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_ARRIVING'
  | 'DRIVER_ARRIVED'
  | 'RIDE_IN_PROGRESS'
  | 'RIDE_COMPLETED';

interface RideState {
  currentStatus: RideStatus;
  flowStep: FlowStep;
  pickup: LocationPoint;
  destination: LocationPoint | null;
  selectedVehicle: VehicleOption;
  appliedPromo: PromoCode | null;
  activeRide: ActiveRide | null;
  searchCountdown: number;

  setFlowStep: (step: FlowStep) => void;
  setPickup: (loc: LocationPoint) => void;
  setDestination: (loc: LocationPoint | null) => void;
  setSelectedVehicle: (vehicle: VehicleOption) => void;
  applyPromo: (promo: PromoCode | null) => void;

  startSearchingForDriver: () => void;
  simulateDriverArriving: () => void;
  simulateDriverArrived: () => void;
  startTrip: () => void;
  completeTrip: (rating?: number, driverTip?: number, reviewTags?: string[]) => void;
  cancelRide: () => void;
  resetRide: () => void;
}

export const useRideStore = create<RideState>((set, get) => ({
  currentStatus: 'IDLE',
  flowStep: 'IDLE',
  pickup: SM_HEIGHTS_PICKUP,
  destination: CP67_MALL_DESTINATION,
  selectedVehicle: MOCK_VEHICLES[0],
  appliedPromo: MOCK_OFFERS[0], // QUICK50
  activeRide: null,
  searchCountdown: 3,

  setFlowStep: (step) => set({ flowStep: step }),

  setPickup: (loc) => set({ pickup: loc }),

  setDestination: (loc) => set({ destination: loc }),

  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

  applyPromo: (promo) => set({ appliedPromo: promo }),

  startSearchingForDriver: () => {
    const { pickup, destination, selectedVehicle } = get();
    const dest = destination || POPULAR_DESTINATIONS[0];

    const baseFare = selectedVehicle.basePrice;
    const distanceFare = Math.round(selectedVehicle.price - baseFare);
    const tax = 0;
    const discount = 0;
    const totalFare = selectedVehicle.price;

    const newRide: ActiveRide = {
      id: `ride-${Date.now()}`,
      pickup,
      destination: dest,
      vehicle: selectedVehicle,
      driver: driverForVehicle(selectedVehicle),
      otpPin: '4821',
      status: 'SEARCHING_DRIVER',
      distanceKm: 6.8,
      durationMin: 12,
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
      flowStep: 'SEARCHING_DRIVER',
      activeRide: newRide,
      searchCountdown: 3,
    });

    // Progress the driver lifecycle automatically
    setTimeout(() => {
      const current = get().currentStatus;
      if (current === 'SEARCHING_DRIVER') {
        // Step 1: Finding driver succeeded -> DRIVER_ASSIGNED
        set({
          currentStatus: 'DRIVER_ASSIGNED',
          flowStep: 'DRIVER_ASSIGNED',
          activeRide: {
            ...newRide,
            status: 'DRIVER_ASSIGNED',
            driver: driverForVehicle(selectedVehicle),
          },
        });

        // Step 2: Driver starts moving en route -> DRIVER_ARRIVING after 2s
        setTimeout(() => {
          if (get().currentStatus !== 'DRIVER_ASSIGNED') return;
          get().simulateDriverArriving();

          // Step 3: Driver completes arrival journey (13s) -> DRIVER_ARRIVED
          setTimeout(() => {
            if (get().currentStatus !== 'DRIVER_ARRIVING') return;
            get().simulateDriverArrived();

            // Step 4: OTP shared with driver (3s pause) -> start trip
            setTimeout(() => {
              if (get().currentStatus === 'DRIVER_ARRIVED') {
                get().startTrip();
              }
            }, TRIP_START_DELAY_MS);
          }, 13000);
        }, 2000);
      }
    }, 2800);
  },

  simulateDriverArriving: () => {
    const active = get().activeRide;
    if (!active) return;
    set({
      currentStatus: 'DRIVER_ARRIVING',
      flowStep: 'DRIVER_ARRIVING',
      activeRide: {
        ...active,
        status: 'DRIVER_ARRIVING',
      },
    });
  },

  simulateDriverArrived: () => {
    const active = get().activeRide;
    if (!active) return;
    set({
      currentStatus: 'DRIVER_ARRIVED',
      flowStep: 'DRIVER_ARRIVED',
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
      flowStep: 'RIDE_IN_PROGRESS',
      activeRide: {
        ...active,
        status: 'RIDE_IN_PROGRESS',
      },
    });

    // The driver ends the simulated ride, rather than exposing that control to the rider.
    setTimeout(() => {
      if (get().currentStatus === 'RIDE_IN_PROGRESS') {
        get().completeTrip();
      }
    }, RIDE_END_DELAY_MS);
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
      flowStep: 'RIDE_COMPLETED',
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
      flowStep: 'IDLE',
      activeRide: null,
    });
  },

  resetRide: () => {
    set({
      currentStatus: 'IDLE',
      flowStep: 'IDLE',
      activeRide: null,
    });
  },
}));
