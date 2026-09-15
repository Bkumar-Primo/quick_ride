import { create } from 'zustand';
import { MOCK_RIDE_HISTORY, MOCK_USER } from '../data';
import type { ActiveRide, LocationPoint, UserProfile } from '../types';

interface UserState {
  user: UserProfile;
  rideHistory: ActiveRide[];
  selectedPaymentMethod: 'Cash' | 'QuickRide Wallet' | 'Google Pay' | 'Apple Pay' | 'Credit Card';

  // Actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  addSavedPlace: (place: LocationPoint) => void;
  removeSavedPlace: (placeId: string) => void;
  addFundsToWallet: (amount: number) => void;
  setPaymentMethod: (method: UserState['selectedPaymentMethod']) => void;
  addCompletedRide: (ride: ActiveRide) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: MOCK_USER,
  rideHistory: MOCK_RIDE_HISTORY,
  selectedPaymentMethod: 'QuickRide Wallet',

  updateProfile: (updates) =>
    set((state) => ({
      user: { ...state.user, ...updates },
    })),

  addSavedPlace: (place) =>
    set((state) => ({
      user: {
        ...state.user,
        savedPlaces: [...state.user.savedPlaces, place],
      },
    })),

  removeSavedPlace: (placeId) =>
    set((state) => ({
      user: {
        ...state.user,
        savedPlaces: state.user.savedPlaces.filter((p) => p.id !== placeId),
      },
    })),

  addFundsToWallet: (amount) =>
    set((state) => ({
      user: {
        ...state.user,
        walletBalance: state.user.walletBalance + amount,
      },
    })),

  setPaymentMethod: (method) => set({ selectedPaymentMethod: method }),

  addCompletedRide: (ride) =>
    set((state) => ({
      rideHistory: [ride, ...state.rideHistory],
      user: {
        ...state.user,
        totalRides: state.user.totalRides + 1,
      },
    })),
}));
